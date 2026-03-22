"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function FileTree({ repoId }: { repoId: string }) {
  const { data } = useQuery({
    queryKey: ["files", repoId],
    queryFn: async () => {
      const res = await api.get(`/repo/${repoId}/files`);
      return res.data.files;
    },
  });

  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Files</h2>

      {data?.map((file: string) => (
        <div key={file} className="text-sm py-1">
          {file}
        </div>
      ))}
    </div>
  );
}
