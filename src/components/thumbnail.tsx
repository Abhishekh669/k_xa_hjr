import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailPrpps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailPrpps) => {
  if (!url) return null;
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[36px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Message image"
            className=" min-w-screen rounded-[5px] object-cover w-[400px] h-[100px]"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          alt="Message image"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};
