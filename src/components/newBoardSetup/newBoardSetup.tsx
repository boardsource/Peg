import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import Button from "../button/button";

import { Modal } from "../../logic/modal";
import NewBoardSetupModal from "./newBoardSetupModal";

type NewBoardSetupProps = {
};


export default function NewBoardSetup(props: NewBoardSetupProps) {

    const openModal = () => {
        const modal = Modal.getInstance()
        modal.Open(`New Board Setup`, false, (
            <NewBoardSetupModal close={() => { modal.Close() }} />
        )
        )
    }
    return (
        <div className="NewBoardSetup flex flex-col w-full h-full justify-center relative">
            <div className="newboard flex flex-col items-center self-center absolute bottom-0">
                <h2 className='text-[1rem] mb-1'>Board Not Appearing?</h2>
                <p className='text-[.75rem] mb-3'>You may need to configure your board to work with Peg.</p>
                <Button className={`btn-success btn-outline btn-xs mt-1 mb-[2.2rem]`} onClick={openModal} selected={true}  >
                    Setup New Board
                </Button>
                <p className='text-[.75rem]'>Visit <a href="https://peg.software" className='link link-primary' target='_blank'>peg.software</a> for help setting up a new board.</p>
            </div>
        </div>
    );
}
