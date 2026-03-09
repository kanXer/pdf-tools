"use client";

import { useState, use } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { setUploadedFiles } from "@/lib/fileStore";

const tools = {
"compress-pdf": { name: "Compress PDF", accept: ".pdf", multiple:false, min:1 },
"merge-pdf": { name: "Merge PDF", accept: ".pdf", multiple:true, min:2 },
"split-pdf": { name: "Split PDF", accept: ".pdf", multiple:false, min:1 },
"pdf-to-jpg": { name: "PDF to JPG", accept: ".pdf", multiple:false, min:1 },
"pdf-to-png": { name: "PDF to PNG", accept: ".pdf", multiple:false, min:1 },
"word-to-pdf": { name: "Word to PDF", accept: ".doc,.docx", multiple:false, min:1 },
"excel-to-pdf": { name: "Excel to PDF", accept: ".xls,.xlsx", multiple:false, min:1 },
"image-to-pdf": { name: "Image to PDF", accept: "image/*", multiple:true, min:1 },
} as const;

type ToolSlug = keyof typeof tools;

export default function ToolPage({
params,
}:{
params:Promise<{slug:string}>
}){

const {slug}=use(params);
const tool=tools[slug as ToolSlug];
const router=useRouter();

const [files,setFiles]=useState<File[]>([]);

if(!tool) return <div className="text-center py-20">Tool not found</div>;

const handleFiles=(e:React.ChangeEvent<HTMLInputElement>)=>{

if(!e.target.files) return;

let selected = Array.from(e.target.files);

// single file tools
if(!tool.multiple){
selected=[selected[0]];
}

setFiles(selected);

};

const canGoNext = files.length >= tool.min;

const goNext=()=>{

if(!canGoNext) return;

/* -------- save files in memory -------- */
setUploadedFiles(files);

/* -------- save metadata for preview UI -------- */

const meta = files.map(file=>({

name:file.name,
size:file.size,
type:file.type

}));

sessionStorage.setItem("filesMeta",JSON.stringify(meta));

router.push(`/tools/${slug}/preview`);

};

return(

<main className="min-h-screen bg-white">

<br/><br/>

<section className="text-center py-16 px-6">

<h1 className="text-4xl font-bold text-gray-900">
{tool.name}
</h1>

<p className="mt-4 text-gray-600">
Upload your files
</p>

</section>

<section className="max-w-3xl mx-auto px-6 pb-20">

<div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">

<Upload size={40} className="mx-auto text-gray-400"/>

<p className="mt-4 text-gray-600">
Drag & Drop files
</p>

<label className="inline-block mt-4">

<input
type="file"
multiple={tool.multiple}
accept={tool.accept}
className="hidden"
onChange={handleFiles}
/>

<span className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg">
Select Files
</span>

</label>

{/* file list */}

{files.length>0 &&(

<div className="mt-6 text-sm text-gray-700">

{files.map((file,i)=>(
<p key={i} className="font-medium">
{file.name}
</p>
))}

</div>

)}

</div>

{/* action area */}

{files.length>0 &&(

<div className="text-center mt-8">

{slug==="merge-pdf" && files.length<2 &&(

<p className="text-red-500 mb-4 text-sm font-semibold">
⚠ Please select at least 2 files to merge
</p>

)}

<button
onClick={goNext}
disabled={!canGoNext}
className={`px-8 py-3 rounded-lg font-bold transition ${
canGoNext
? "bg-green-600 text-white hover:bg-green-700"
: "bg-gray-300 text-gray-500 cursor-not-allowed"
}`}
>

Next

</button>

</div>

)}

</section>

</main>

);

}