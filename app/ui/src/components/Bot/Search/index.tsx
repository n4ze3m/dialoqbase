import DefaultSearchBox from "./DefaultSearchBox";
import { useState } from "react";
import AISearchEngine from "./AISearchEngine";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { ISearchResult } from "./types";
import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import axios from "axios";
import { useSettings } from "../../../hooks/useSettings";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const BotSearchFeature = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultSearchBox, setDefaultSearchBox] = useState(true);
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<ISearchResult>([]);
  const { data: settings, status } = useSettings();
  const onSearch = async (query: string) => {
    const res = await api.post(`/bot/${params.id}/search`, {
      query,
    });

    return res.data as ISearchResult;
  };

  const { isLoading, mutate: search } = useMutation({
    mutationFn: onSearch,
    onSuccess: (data) => {
      setData(data);
    },
    onError: (err: any) => {
      notification.error({
        message: axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err.message,
      });
    },
  });
  if (status === "success" && !settings.internalSearchEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-center text-gray-900 dark:text-white">
          Internal search needs to be enabled by an admin in order to use this
          feature.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto my-3 w-full max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Search
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Search documents using semantic search. This feature is
            experimental.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {defaultSearchBox ? (
          <motion.div
            key="defaultSearchBox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DefaultSearchBox
              onSubmit={(query) => {
                if (query.length === 0) {
                  return;
                }
                search(query);
                setDefaultSearchBox(false);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </motion.div>
        ) : (
          <motion.div
            key="aiSearchEngine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AISearchEngine
              onSubmit={(query) => {
                if (query.length === 0) {
                  return;
                }
                search(query);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isLoading={isLoading}
              data={data}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
