import { Show, createSignal, onMount, For, onCleanup } from "solid-js";

import { ElectronEvents, FileName, KeyCode } from "../../types/types"

import axios from "axios"
import { ProgramSettings } from "../../logic/programSettings";
import { ClientManager } from "../../logic/clientManager";
import Button from "../button/button";
import { Toast } from "../../logic/toast";
import Toggle from "../toggle/toggle";
import pegSquareLogo from '../../images/peg_square_logo.svg'
import { waitUntil } from "workbox-core/_private";
import { KeyMap } from "../../logic/keymapManager";
import { Modal } from "../../logic/modal";
import NewBoardSetupModal from "./newBoardSetupModal";

type NewBoardSetupProps = {
};


export default function NewBoardSetup(props: NewBoardSetupProps) {

    const openModal = () => {
        const modal = Modal.getInstance()
        modal.Open(`New Board Setup`, false, (
            <NewBoardSetupModal />
        )
        )
    }
    return (



        // **** this NewBoardSetup may all become Loading component if you want/are okay with it *********
        <div className="NewBoardSetup flex flex-col w-full h-full justify-center relative">


            <div className="newboard flex flex-col items-center self-center absolute bottom-0">
                <h2 className='text-[1rem] mb-1'>Board Not Appearing?</h2>
                <p className='text-[.75rem] mb-3'>You may need to configure your board to work with Peg.</p>
                <Button className={`btn-success btn-outline btn-xs mt-1 mb-[2.2rem]`} onClick={openModal} selected={true}  >
                    Setup New Board
                </Button>
                <p className='text-[.75rem]'>Visit <a href="https://peg.software" className='link link-primary' target='_blank'>peg.software</a> for help setting up a new board.</p>
                {/* ******* all of this stuff open in modal? ****** good way to fit it all OR we can have it replace the animation for scanning that is also a good option and keeps it all on page ****** */}

            </div>



        </div>
    );
}
