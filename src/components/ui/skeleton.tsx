function Skeleton({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={"bg-muted animate-pulse rounded-md"} {...props} />;
}

export { Skeleton };
