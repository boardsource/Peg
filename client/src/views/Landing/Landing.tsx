import "./Landing.css";
export default function Landing() {
  return (
    <div className="landing">
      <h1>mycarrier.site/</h1>
      <h2>A new carrier pigeon</h2>
      <div>
        <p>
          This site is made to quickly transfer text between devices without
          needing to log in, install type(much). To enable sharing more
          sensitive data I made it password protected. All I needed to do was
          fetch data more often and throw in some usernames now we have a chat.
          When using this site you should never see this page. You should type
          in mycarrier.site/yourpage and go to get your string, or share that
          with a friend to have an encrypted chat.
        </p>
        <h3>Features</h3>
        <ul>
          <li>
            Everything is fleeting. Your page won't be here forever. You can go
            back to the same page and if you are using it quickly you won't have
            a problem but don't expect to use this like a notes or pastebin.
            Those services are there, use them.
          </li>
          <li>
            Push your settings to the page. Next time any one goes to the page
            the settings(including theme) will be set up
          </li>
          <li>Nothing is logged</li>
          <li>
            If you chose to put a password on your data before you send it I
            can't see it encryption is done client side. Don't trust me tho open
            the network calls and watch them before you feel safe using the
            service
          </li>
          <li>Encryption is strong it is using aes256</li>
          <li>api is super simple feel free to make your own client</li>
        </ul>
        <h3>Todo / road map</h3>
        <ol>
          <li>pwa quickly "install" to your phone if you use it a lot</li>
          <li>push notifications</li>
          <li>tor hidden service </li>
          <li>custom encoder / decoder</li>
          <li>fully encrypted file uploads</li>
          <li>browser extensions</li>
        </ol>
        <h3>Talk to me</h3>

        <p>
          I will check <a href="/creator">mycarrier.site/creator</a> feel free
          to leave your feedback or suggestion there. I would love to add to the
          todo list with things the people want
        </p>
      </div>
    </div>
  );
}
