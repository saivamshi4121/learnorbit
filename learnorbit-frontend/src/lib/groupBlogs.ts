export interface Blog {
    id: string;
    title: string;
    cover_image?: string;
    author_id: string;
    author_name?: string;
    created_at: string;
    content?: string;
    slug: string;
}

export interface BlogGroup {
    type: 'single' | 'playlist';
    authorId: string;
    authorName?: string;
    blogs: Blog[];
}

export function groupBlogs(blogs: Blog[]): BlogGroup[] {
    // 1. Sort blogs by createdAt DESC
    const sortedBlogs = [...blogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 2. Group by authorId
    const authorGroups: Record<string, Blog[]> = {};
    const orderedAuthorIds: string[] = []; // maintain relative order of appearance

    sortedBlogs.forEach(blog => {
        if (!authorGroups[blog.author_id]) {
            authorGroups[blog.author_id] = [];
            orderedAuthorIds.push(blog.author_id);
        }
        authorGroups[blog.author_id].push(blog);
    });

    // 3. Form final groups based on count
    const result: BlogGroup[] = [];
    
    orderedAuthorIds.forEach(authorId => {
        const authorBlogs = authorGroups[authorId];
        const authorName = authorBlogs[0].author_name;
        
        if (authorBlogs.length >= 3) {
            result.push({
                type: 'playlist',
                authorId,
                authorName,
                blogs: authorBlogs
            });
        } else {
            // For 1-2 blogs, render individually
            authorBlogs.forEach(blog => {
                result.push({
                    type: 'single',
                    authorId,
                    authorName,
                    blogs: [blog]
                });
            });
        }
    });

    return result;
}
