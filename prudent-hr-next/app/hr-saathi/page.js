// app/hr-saathi/page.js
import { getAllBlogs } from "@/lib/data-service";
import BlogCard from "@/components/BlogCard"; // You will create this next

export default async function HRSaathiPage() {
  const blogs = await getAllBlogs();

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-5xl font-black text-center mb-12">Verified <span className="text-indigo-600">HR Feed</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </main>
  );
}