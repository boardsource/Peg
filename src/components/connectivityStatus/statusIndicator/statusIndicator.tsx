import { ConnectionStatus } from "../connectivityStatus";

type StatusProps = {
    status: ConnectionStatus,
    keyboard?: string
}





export default function StatusIndicator(props: StatusProps) {

    const returnStatusDetails = () => {
        const keyboard = props.keyboard ? props.keyboard : 'Board Not Found'
        switch (props.status) {
            case ConnectionStatus.BoardAndInternet:
                return (
                    //internet and board connected 
                    {
                        styles: 'border border-success text-success',
                        statusText: 'INTERNET CONNECTED',
                        board: keyboard,
                        icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>),

                    }

                );
            case ConnectionStatus.Board:
                return (
                    //board connected no internet
                    {
                        styles: 'border border-info text-info',
                        statusText: 'NO INTERNET',
                        board: keyboard,
                        icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-gray-400" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>),
                    }

                );
            case ConnectionStatus.Internet:
                return (
                    //internet connected no board
                    {
                        styles: 'border border-warning text-warning',
                        statusText: 'INTERNET CONNECTED',
                        board: keyboard,
                        icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>),
                    }
                );
            case ConnectionStatus.NoConnection:
                return (
                    //NO INTERNET NO BOARD
                    {
                        styles: 'border border-error text-error',
                        statusText: 'NO INTERNET',
                        board: keyboard,
                        icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>),
                    }
                );
        }
    }

    return (
        <div className={`${returnStatusDetails().styles} statusindicator flex items-center px-3 py-1.5 border-2 font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}>
            {returnStatusDetails().icon}
            <p className='text-gray-400 text-[10px] ml-1'>{returnStatusDetails().statusText}</p>
            <p className='ml-2'>{returnStatusDetails().board}</p>
            {/* <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg> */}

            {/* this is the old way we did it delete if you're cool with it*/}
            {/* {renderStatusIndicator()} */}







            {/* I AM KEEPING THIS AROUND BECAUSE IT'S EASIER TO STYLE HERE THEN REPLCACE ABOVE */}
            {/* <div className="statusindicator flex items-center px-3 py-1.5 border-2 border-green-500 text-green-500 font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <p className='text-gray-400 text-[10px] ml-1'>INTERNET CONNECTED</p>
                <p className='ml-2'>{props.keyboard}</p>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="statusindicator flex items-center px-3 py-1.5 border-2 border-lime-400 text-lime-500 font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-gray-400" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <p className='text-gray-400 text-[10px] ml-1'>NO INTERNET</p>
                <p className='ml-2'>{props.keyboard}</p>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="statusindicator flex items-center px-3 py-1.5 border-2 border-orange-400 text-orange-500 font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <p className='text-gray-400 text-[10px] ml-1'>INTERNET CONNECTED</p>
                <p className='ml-2 text-red-400'>Board Not Found</p>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="statusindicator flex items-center px-3 py-1.5 border-2 border-rose-500 text-rose-500 font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <p className='text-gray-400 text-[10px] ml-1'>NO INTERNET</p>
                <p className='ml-2 text-red-400'>Board Not Found</p>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div> */}
        </div>



    )
}

