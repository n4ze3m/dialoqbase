export const ApplicationCard = ({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div>
      <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-200">
        {description}
      </p>

      <dl className="mt-6 space-y-6 divide-y divide-gray-100  border-gray-200 text-sm leading-6 dark:text-gray-200">
        <div className="mt-5 md:col-span-2 md:mt-0">{children}</div>
      </dl>
    </div>
  );
};
