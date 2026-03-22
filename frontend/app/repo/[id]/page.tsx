import RepoWorkspace from "@/components/repo/repo-workspace";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RepoWorkspace repoId={id} />;
}
