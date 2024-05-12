import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone-esm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Uploader() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const [file, setFile] = useState<File>();
  const [passwordInput, setPasswordInput] = useState("");

  const onDrop = useCallback(async (files: File[]) => {
    if (!files || files.length == 0) return;
    setFile(files[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const upload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setBusy(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", passwordInput);

    const res = await fetch("/api/upload", {
      method: "post",
      body: formData,
    });
    const json = await res.json();
    if (json.success) {
      location.href = `/${json.fileName}`;
    } else {
      setBusy(false);
      setError(json.error);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center text-gray-300 h-28 border-4 border-dashed border-white/20"
        {...getRootProps()}
      >
        <ImageIcon className="mr-2 h-4 w-4" />{" "}
        <p>
          {isDragActive
            ? "Drop image here"
            : file?.name || "Drag and drop image here"}
        </p>
        <input {...getInputProps()} />
      </div>
      <div className="flex items-center justify-center space-x-2 mt-3">
        <Input
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          type="password"
          placeholder="Magic Phrase 🪄"
        />
        <Button onClick={upload}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}
    </>
  );
}
