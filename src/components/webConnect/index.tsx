import IdeManger from "../../logic/backends/web/ideManager";
import WebBackend from "../../logic/backends/web/webBackend";
import Button from "../button/button";

const ideManger = WebBackend.getInstance().ideManger;
type Props = {
};


export default function WebConnect(props: Props) {

    const connect = () => {
        ideManger.connect()
    }

    return (
        <div className="NewBoardSetup flex flex-col w-full h-full justify-center relative">
            <div className="newboard flex flex-col items-center self-center absolute bottom-0">

                <Button className={`btn-success btn-outline btn-xs mt-1 mb-[2.2rem]`} onClick={connect} selected={true}  >
                    Connect to board
                </Button>
            </div>
        </div>
    );
}
