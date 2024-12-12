import SlideBar from "./SlideBar"
import Toolbar from "./Toolbar"

interface WorksSpaceIdLayoutProps{
children : React.ReactNode
}
const WorksSpaceIdLayout = ({children} : WorksSpaceIdLayoutProps) =>{
    return (
        <div className="w-full h-full ">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <SlideBar />
                {children}
            </div>
        </div>
    )

}
export default WorksSpaceIdLayout