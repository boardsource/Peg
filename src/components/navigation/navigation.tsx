import { For } from 'solid-js'
import { NavLink, useLocation } from "solid-app-router";
import bsLogo from '../../images/boardsource_logo.svg'
import pegLogo from '../../images/peg_logo.svg'

export default function Navigation() {
  const navArray = [
    {
      title: 'Home',
      path: '/index.html',
      icon: (<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>),
    },
    {
      title: 'Mapping'
    },
    {
      title: 'Keymap',
      path: '/index.html',
      icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>),
    },
    {
      title: 'Encoder',
      path: '/index.html/encoder',
      icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>),
    },
    {
      title: 'LED',
      path: '/index.html/led',
      icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>),
    },
    {
      title: 'OLED',
      path: '/index.html/oled',
      icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>),
    },
    {
      title: 'Tools'
    },
    {
      title: 'Make Custom',
      path: '/index.html/makeCustom',
      icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>),
    },
    {
      title: 'Code Block',
      path: '/index.html/codeblock',
      icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>),
    },
    // {
    //   title: 'Tester',
    //   path: '/index.html/tester',
    //   icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    //   </svg>),
    // },
    {
      title: 'Settings'
    },
    {
      title: 'Options',
      path: '/index.html/options',
      icon: (<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>),
    },
    {
      title: 'Account',
      path: '/index.html/account',
      icon: (<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>),
    },
  ]
  return (
    <div className="navigation flex flex-col">
      <div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
        <div class="flex flex-col flex-1 top-0 left-0 w-60 bg-white h-full border-r">
          <div class="flex items-center justify-center h-20 border-b p-4">
            <img class='flex h-full' src={pegLogo} alt="peg application logo" />
          </div>
          <div class="overflow-y-auto overflow-x-hidden flex-grow">
            <ul class="flex flex-col py-4 space-y-1">
              <For each={navArray}>
                {(navItem) => (
                  navItem.path ? (
                    <li>
                      <NavLink href={navItem.path} class={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 ${useLocation().pathname === navItem.path ? "bg-gray-50 text-gray-800 border-indigo-500" : ""}`}>
                        <span class="inline-flex justify-center items-center ml-4">
                          {navItem.icon}
                        </span>
                        <span class="ml-2 text-sm tracking-wide truncate">{navItem.title}</span>
                      </NavLink>
                    </li>
                  ) :
                    (
                      <li class="px-5">
                        <div class="flex flex-row items-center h-8">
                          <div class="text-sm font-light tracking-wide text-gray-500">{navItem.title}</div>
                        </div>
                      </li>
                    )

                )}
              </For>
            </ul>
          </div>
          <div className="navigation__bottom flex flex-col w-8/12 ml-5 mb-4">
            <img src={bsLogo} alt="boardsource.xyz logo" />
            <div className="flex self-end"> <a class="text-gray-500 text-[12px] font-thin" href="boardsource.xyz">boardsource.xyz</a>
              {/* <img class="fill-blue-500" src={iconExternalLink} alt="exernal link icon" /></div> */}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-gray-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/'>Home</Link>
      <Separator title='Mapping' />
      <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html'>Keymap</Link>
      <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/led'>LED</Link>
      <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/oled'>OLED</Link>
      <Separator title='Tools' />
      <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/makeCustom'>Custom Key</Link>
      <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/tester'>Tester</Link>
      <Separator title='Settings' />
      <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/options'>Options</Link>
      <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/account'>Account</Link> */}

      {/* put these after the span including the link name/text like a notificaton bade
      <span class="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-indigo-50 rounded-full">New</span>
      <span class="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">1.2k</span>
      <span class="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">15</span> */}
    </div>
  )
}
