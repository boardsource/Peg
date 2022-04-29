import MainView from '../../components/mainView/mainView'
import { For, createSignal } from 'solid-js'
import { Notification } from "../../logic/notification";
import { NotificationColor } from '../../types/types'
import { Modal } from "../../logic/modal";

const notification = Notification.getInstance()

const [layersArray, setLayersArray] = createSignal([1, 2, 3, 4, 5])

const ShareModal = () => {
  // const [title, setTitle] = createSignal(""), [description, setDescription] = createSignal("")
  return (
    <div>
      <div class="mb-3 xl:w-96">
        <label for="title" class="form-label inline-block mb-2 text-gray-700">
          Title
        </label>
        <input
          type="text"
          class="
          form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
          id="title"
          placeholder={`My Awesome THANG`}

        />
      </div>

      <br />
      <div class="mb-3 xl:w-96">
        <label for="description" class="form-label inline-block mb-2 text-gray-700">
          Description
        </label>
        <textarea
          onChange={e => {//@ts-ignore
            setDescription(e.target.value)
          }}
          class="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="description"
          rows="3"
          placeholder="Your description"
        ></textarea>
      </div>
      {/* <Button>
               
                Save
            </Button> */}
    </div>)
}

const openModal = () => {
  const modal = Modal.getInstance()
  modal.Open(`Share your THANGS}`, true, (
    // <ShareModal featureType={props.featureType} keycode={props.keycode} close={() => modal.Close()} />))
    <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error facere totam doloremque cupiditate odio est quaerat aut non repellendus. Officia eos aliquam temporibus amet doloremque voluptatum enim maxime facere culpa!</h1>))
}


export default function Options() {
  return (
    <MainView title="Options">
      <p>options will go here</p>
      <p>testisfng</p>
      <button onClick={() => notification.Show('TESTING', 'this is a test notifiasdfkjsadlfjsadlfjcation', NotificationColor.Green, 5000)}>TEST SHOW</button>
      <div className="testToggle">
        <p>SELECT THEME:</p>
        <div class="dropdown">
          <select class="select select-primary w-full max-w-xs">
            <option disabled selected>What is the best TV show?</option>
            <option>Game of Thrones</option>
            <option>Lost</option>
            <option>Breaking Bad</option>
            <option>Walking Dead</option>
          </select>
        </div>
        <div className="layer-selector">
          <For each={layersArray()} fallback={<div>Loading...</div>}>
            {/* ASK COLE ABOUT STUFF IN () BELOW, ref other component */}
            {() => (
              <div className="test"><p>hi</p></div>
            )}
          </For>
        </div>

        <button onClick={openModal}>OPEN MODAL</button>
      </div>
    </MainView >
  )
}