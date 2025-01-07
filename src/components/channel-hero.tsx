import { format } from "date-fns";


interface ChannelHeroProps{
    name : string;
    creationtime: number;
};

export const ChannelHero = ({name, creationtime} : ChannelHeroProps) =>{
    return(
        <div className="mt-[88px] text-black mx-5 mb-4">
            <p className="text-2xl font-bold flex items-center mb-2 ">
                # {name}
            </p>
        <p className="font-normal text-slate-800 mb-4">
                This channel was created on {format(creationtime, "MMMM do, yyyy")}. This is the very beginning of the <strong>{name}</strong> channel
        </p>
        </div>
    )
}