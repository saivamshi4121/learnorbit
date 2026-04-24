import { BlogCard } from "./BlogCard";
import { PlaylistCard } from "./PlaylistCard";
import { BlogGroup } from "@/lib/groupBlogs";

export function Feed({ groups }: { groups: BlogGroup[] }) {
    if (groups.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500">No blogs published yet.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-8">
            {groups.map((group) => {
                if (group.type === 'single') {
                    return <BlogCard key={`single-${group.blogs[0].id}`} blog={group.blogs[0]} />;
                } else {
                    return <PlaylistCard key={`playlist-${group.authorId}`} group={group} />;
                }
            })}
        </div>
    );
}
