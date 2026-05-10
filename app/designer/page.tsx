import DesignerTool from "@/components/designer/DesignerTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designer Studio | Double Design Paints",
  description: "Upload an image of your space and visualize our premium finishes on your walls, floors, doors, and windows.",
};

export default function DesignerPage() {
  return (
    <div className="min-h-screen bg-bone pt-24 pb-32 px-4 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-16 max-w-2xl">
          <h1 className="text-display font-display leading-none mb-6">
            The Virtual <br />
            <span className="italic text-slate">Atelier.</span>
          </h1>
          <p className="text-body opacity-80 max-w-xl">
            Upload a photo of your space, select a surface, and let our AI model apply our premium finishes. See the transformation before ordering a sample.
          </p>
        </header>

        <DesignerTool />
      </div>
    </div>
  );
}
