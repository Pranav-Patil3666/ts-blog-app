import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialForm = {
  title: "",
  description: "",
  category: "",
  content: "",
  image: null,
};

export function CreateBlogModal({ isOpen, onClose, onSubmit, submitting, error, user }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((current) => ({ ...current, image: file }));
  };

  const submit = (mode) => {
    onSubmit?.({
      ...form,
      mode,
      authorId: user?._id || user?.id || "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#2B2B2B]/40 px-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl rounded-[2rem] border border-white/50 bg-white p-6 shadow-[0_30px_80px_rgba(43,43,43,0.2)] sm:p-7"
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-ink">Create a new story</div>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  Shape your draft in a clean writing surface, then save or publish when it feels ready.
                </p>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-vanilla text-ink transition hover:bg-copper/10 hover:text-copper"
                onClick={onClose}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blog-title">Title</Label>
                <Input
                  className="h-12 rounded-2xl"
                  id="blog-title"
                  name="title"
                  onChange={handleChange}
                  placeholder="Write a standout title..."
                  value={form.title}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="blog-description">Description</Label>
                  <Input
                    className="h-12 rounded-2xl"
                    id="blog-description"
                    name="description"
                    onChange={handleChange}
                    placeholder="Short summary for your blog"
                    value={form.description}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-category">Category</Label>
                  <Input
                    className="h-12 rounded-2xl"
                    id="blog-category"
                    name="category"
                    onChange={handleChange}
                    placeholder="Writing, Tech, Design..."
                    value={form.category}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-image">Cover image</Label>
                <Input
                  accept="image/*"
                  className="h-12 rounded-2xl"
                  id="blog-image"
                  onChange={handleFileChange}
                  type="file"
                />
              </div>
              <Textarea
                className="min-h-60 rounded-[1.5rem] bg-[linear-gradient(180deg,#fffdfb_0%,#f8efe7_100%)]"
                name="content"
                onChange={handleChange}
                placeholder="Start writing your next blog post..."
                value={form.content}
              />
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                className="rounded-2xl"
                disabled={submitting}
                onClick={() => submit("draft")}
                variant="secondary"
              >
                {submitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                Draft
              </Button>
              <Button className="rounded-2xl" disabled={submitting} onClick={() => submit("publish")}>
                {submitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                Publish
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
