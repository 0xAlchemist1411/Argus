import FileTree from "@/components/FileTree";
import CodeViewer from "@/components/CodeViewer";
import ChatPanel from "@/components/ChatPanel";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <FileTree repoId={id} />
      </div>

      <div className="w-2/4">
        <CodeViewer />
      </div>

      <div className="w-1/4 border-l">
        <ChatPanel repoId={id} />
      </div>
    </div>
  );
}
