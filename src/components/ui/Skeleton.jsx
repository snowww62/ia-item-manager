import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const ItemCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="aspect-[4/3] rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  </div>
);

export const RowSkeleton = () => (
  <div className="flex items-center gap-3 bg-surface-raised border border-line rounded-sm p-4">
    <Skeleton className="h-9 w-9 rounded-sm shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3.5 w-2/5" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

export default Skeleton;
