export type GetAllModelResponse = {
  data: {
    id: number;
    name: string | null;
    model_id: string;
    model_type: string;
    stream_available: boolean;
    model_provider: string | null;
    local_model: boolean;
    config: any;
    hide: boolean;
    deleted: boolean;
    createdAt: string;
  }[];
};
