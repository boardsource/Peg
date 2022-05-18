import Button from '../../components/button/button'

type PppFallbackProps = {

}

export default function PppFallback(props: PppFallbackProps) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center border border-primary rounded rounded-xl">
      <div className="flex flex-col justify-center items-center content-center">
        <h3 className='text-[1.3rem] mb-1'>Peg Pro Account Feature</h3>
        <h4 className='mb-[3.5rem] text-[.9rem]'>In order to use this feature of Peg you must upgrade your account and purchase a license.</h4>
        <Button className='btn-outline btn-success relative animate-bounce' selected={true} onClick={() => { }}>
          {/* <span class="flex absolute -right-[0.2rem] -top-[0.2rem] h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span> */}
          Upgrade Your Account
        </Button>

        <p className='text-[.75rem] mt-[1rem]'>To learn more about our pricing, features, and licenses please visit <span className='text-primary'>peg.software</span>.</p>
      </div>

    </div>
  )
}

