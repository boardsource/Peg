import { For } from 'solid-js'
import { NavLink, useLocation } from "solid-app-router";
import bsLogo from '../../images/boardsource_logo.svg'
import pegLogo from '../../images/peg_logo.svg'
import ShareExternalIcon from '../../images/icons/shareExternalIcon';

export default function Navigation() {
  const navArray = [
    // {
    //   title: 'Home',
    //   path: '/index.html',
    //   icon: (<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>),
    // },
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
      icon: (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
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
    // {
    //   title: 'Account',
    //   path: '/index.html/account',
    //   icon: (<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>),
    // },
  ]
  return (
    <div className="navigation flex flex-col">
      <div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased text-base-content">
        <div class="flex flex-col flex-1 top-0 left-0 w-60 bg-white h-full border-r border-base-300">
          <div class="bg-base-200 flex items-center justify-center h-[7rem] border-b border-base-300 py-7">
            <div className="flex h-full w-[100%] justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2284.97729 975.98346">
                {/* <defs>
                  <style>.
                    cls-1,.cls-2{fill:none;stroke-miterlimit:10;stroke-width:28px;}
                  .cls-1{stroke:#805ff7;}
                  .cls-2{stroke:#98fce9;}
                  .cls-3{fill:#231f20;}
                  </style>
                </defs> */}
                <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_1-2" data-name="Layer 1">
                    <rect className="cls-1 fill-[none] stroke-[28px] stroke-[#805ff7]" x="105.03159" y="105.03159" width="765.92028" height="765.92028" rx="163.19043" transform="translate(-202.13279 487.99173) rotate(-45)" />
                    <circle className="cls-2 fill-[none] stroke-[28px] stroke-[#98fce9]" cx="205.74182" cy="487.99173" r="108.35348" />
                    <path className="cls-3 stroke-3 fill-base-content" d="M1343.39623,245.39066q46.66113,0,82.69727,22.99023,36.0293,23.001,57.30468,63.1377,21.26369,40.14843,21.27442,92.30566,0,52.16309-21.27442,92.64844-21.28125,40.50147-57.64843,63.82422-36.38379,23.33936-81.667,23.334a143.352,143.352,0,0,1-45.63867-7.20605,154.96131,154.96131,0,0,1-39.46093-19.55957,152.45471,152.45471,0,0,1-31.56934-29.167,150.288,150.288,0,0,1-21.96094-36.03028l12.35352-9.60742V715.49515a20.3575,20.3575,0,0,1-5.834,14.41113,19.44,19.44,0,0,1-14.75488,6.17676,20.53225,20.53225,0,0,1-15.09863-6.17676,19.75079,19.75079,0,0,1-6.17578-14.41113v-447.458a21.1641,21.1641,0,0,1,5.833-15.09765q5.82276-6.17726,15.44141-6.17676a19.44,19.44,0,0,1,14.75488,6.17676,21.21059,21.21059,0,0,1,5.834,15.09765v74.11914l-9.6084-5.49023a119.50789,119.50789,0,0,1,20.24512-38.08887,138.57486,138.57486,0,0,1,70.34472-47.01074A159.16167,159.16167,0,0,1,1343.39623,245.39066Zm-3.43164,38.43164q-37.05908,0-65.19726,18.18652-28.14844,18.19189-44.26465,49.41211-16.13379,31.23633-16.12793,72.40332,0,40.50147,16.12793,72.7461,16.11621,32.26611,44.26465,50.4414,28.13232,18.1919,65.19726,18.18653,36.36768,0,64.168-18.18653,27.79395-18.17579,43.92187-50.4414,16.11622-32.25,16.12793-72.7461,0-40.48534-16.12793-72.05957-16.13378-31.55859-43.92187-49.75586Q1376.33716,283.833,1339.96459,283.8223Z" />
                    <path class="cls-3 fill-base-content" d="M1745.5515,605.68949q-53.53125,0-93.67773-22.64746a161.72266,161.72266,0,0,1-62.79492-63.13868q-22.64795-40.48535-22.64746-94.707,0-58.32275,22.99023-99.51074,22.98486-41.17676,59.707-63.48145,36.70459-22.29345,77.89258-22.30371a166.51288,166.51288,0,0,1,58.67774,10.63672,147.1139,147.1139,0,0,1,50.4414,31.56934q21.95655,20.94287,35.6875,51.12793,13.71973,30.208,14.41113,70.001a18.64552,18.64552,0,0,1-6.17578,14.06934,20.315,20.315,0,0,1-14.41211,5.833H1590.45092l-8.23535-37.05957h269.71l-8.92188,8.23535V380.58792q-2.751-32.25-20.58886-54.55957a122.06732,122.06732,0,0,0-42.89258-34.31347,120.12638,120.12638,0,0,0-52.501-12.01075,118.1296,118.1296,0,0,0-42.20605,8.23536,110.80949,110.80949,0,0,0-39.11817,25.73632q-17.50049,17.5005-28.48047,44.6084-10.98632,27.11865-10.98144,64.167,0,40.50147,16.47168,73.43262a127.14809,127.14809,0,0,0,47.35351,52.15723q30.88184,19.22168,74.80469,19.2168,23.32324,0,42.54981-6.86329a123.67422,123.67422,0,0,0,33.9707-18.18652,134.06647,134.06647,0,0,0,24.36328-23.67676q6.85254-6.17724,14.41211-6.17675a16.73278,16.73278,0,0,1,12.69629,5.49023,17.64009,17.64009,0,0,1,5.14648,12.35352q0,8.23534-6.8623,14.4121-20.58839,24.70607-53.53027,42.89258Q1784.66967,605.67874,1745.5515,605.68949Z" />
                    <path class="cls-3 fill-base-content" d="M2111.3474,239.90042a147.66985,147.66985,0,0,1,56.27539,10.63672,165.21381,165.21381,0,0,1,45.6377,27.45117q19.56006,16.8252,30.54,35.6875,10.96875,18.88331,10.98047,36.0293l-10.98047-16.4707V269.41019a21.168,21.168,0,0,1,5.833-15.09863,20.71489,20.71489,0,0,1,29.51074,0,21.21379,21.21379,0,0,1,5.833,15.09863V567.25785q0,54.20506-22.64746,91.96191a148.3247,148.3247,0,0,1-61.42188,57.30469q-38.78173,19.55859-88.1875,19.55859a221.55511,221.55511,0,0,1-50.44238-6.17676q-26.42725-6.17577-45.29492-15.78418-18.88331-9.61817-21.61719-19.90234-4.81055-6.17578-4.46094-12.00977a13.76442,13.76442,0,0,1,5.14648-9.95117q6.85254-4.80908,14.75586-1.02929,7.88086,3.76317,22.99024,9.95117,6.17578,2.0581,18.18652,6.17675a207.99425,207.99425,0,0,0,28.1377,7.20606,176.54338,176.54338,0,0,0,33.28418,3.08789q61.7666,0,96.08008-35.34375,34.30956-35.354,34.31445-92.30469V504.11917l6.8623,2.0586a118.24,118.24,0,0,1-20.24511,42.5498,135.00421,135.00421,0,0,1-33.28516,31.22559,155.82674,155.82674,0,0,1-85.09863,25.73633q-48.04542,0-85.78516-24.02051-37.752-24.01466-59.707-65.19629-21.97266-41.17675-21.96094-94.02149,0-52.147,21.96094-93.67773,21.95508-41.51367,59.707-65.19629Q2063.98315,239.89946,2111.3474,239.90042Zm4.11817,39.11817q-37.06054,0-66.91309,18.52929-29.85351,18.53028-46.667,51.12793-16.8252,32.60449-16.81445,73.77539,0,41.17677,16.81445,74.11915,16.80762,32.9414,46.667,51.81445,29.85353,18.8833,66.91309,18.873,37.73438,0,67.25586-18.53028,29.499-18.52881,46.667-51.12793,17.146-32.58837,17.15723-75.14844,0-42.54345-17.15723-74.80468-17.16212-32.25-46.667-50.44141Q2153.20482,279.02932,2115.46557,279.01859Z" />
                  </g>
                </g>
              </svg>
            </div>
            {/* <img class='flex h-full' src={pegLogo} alt="peg application logo" /> */}
          </div>
          <div class="bg-base-200 overflow-y-auto overflow-x-hidden flex-grow">
            <ul class="flex flex-col py-4 space-y-1">
              <For each={navArray}>
                {(navItem) => (
                  navItem.path ? (
                    <li>
                      <NavLink href={navItem.path} class={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-base-100 text-gray-600 hover:text-primary border-l-4 border-transparent hover:border-primary pr-6 ${useLocation().pathname === navItem.path ? "bg-base-100 text-primary border-primary" : ""}`}>
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
          <div className="bg-base-200 navigation__bottom flex flex-col px-5 pb-5 w-full">
            <div className="flex flex-col content-center items-center w-[80%] self-center">
              <div className="flex justify-center items-end w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4161.82062 714.19376">
                  <g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1">
                    <g id="Page-1">
                      <g id="Group-58">
                        <path id="Boardsource" class="cls-1 fill-base-content" d="M1116.5235,562.23764q33.92665,0,59.1578-9.11514t39.77115-24.88578a103.68105,103.68105,0,0,0,21.52489-34.869,120.448,120.448,0,0,0,6.98489-41.66922q0-45.431-28.65233-72.63176t-77.40406-30.96255v-1.15747q27.65449-1.73622,48.60918-15.91533t31.07566-34.00092a88.992,88.992,0,0,0,10.121-40.9458q0-50.63967-33.64155-77.551t-107.767-26.91137H982.81262a18.093,18.093,0,0,0-12.5443,4.91928,15.76565,15.76565,0,0,0-5.41686,12.15353V544.87547a16.08139,16.08139,0,0,0,5.41686,12.44289,18.093,18.093,0,0,0,12.5443,4.91928Zm-29.93527-226.287h-87.525V179.11234h90.94621q103.20542,0,103.20541,75.23609Q1193.21482,335.95064,1086.58823,335.95064Zm19.10156,198.21815H999.0632v-170.728h86.66974q61.01094,0,91.08875,19.9665t30.07783,63.37194q0,48.3247-23.94822,67.85716T1105.68979,534.16879Zm331.52845,35.30309a143.26185,143.26185,0,0,0,52.458-9.5492,133.132,133.132,0,0,0,43.62-27.63479q19.10156-18.08559,30.07782-47.16724t10.97626-65.83157q0-35.59247-10.83371-64.52942t-29.65018-47.4566a130.05668,130.05668,0,0,0-43.47742-28.35822,148.46346,148.46346,0,0,0-105.91384-.14469,131.18748,131.18748,0,0,0-43.47742,28.06885q-18.959,18.375-29.79272,47.31193t-10.83372,65.10815q0,36.46056,10.97627,65.5422t30.07782,47.31193a132.3346,132.3346,0,0,0,43.47742,27.77947A142.14166,142.14166,0,0,0,1437.21824,569.47188Zm-.5702-23.43893q-47.89642,0-75.40837-35.15841t-27.51194-91.58546q0-57.29519,27.65449-92.01952t75.836-34.72435q48.18153,0,75.97857,35.01372t27.797,91.73015q0,57.00581-27.36939,91.87483T1436.648,546.033Zm282.20653,23.43893q66.1427,0,96.93326-67.71248v48.61409q0,6.07676,4.13392,9.40451a16.06475,16.06475,0,0,0,10.40607,3.32775,22.17469,22.17469,0,0,0,12.82941-3.90649q5.702-3.9065,5.70195-10.27262V363.15138q0-47.45661-27.65449-70.75086t-78.4019-23.29425q-65.0023,0-106.62659,28.64759a8.88261,8.88261,0,0,0-3.42117,7.52361,12.75042,12.75042,0,0,0,3.84882,8.97046,11.73351,11.73351,0,0,0,8.69548,4.05117,10.17949,10.17949,0,0,0,5.98706-2.02559q24.23331-12.44289,43.62-18.0856t47.89643-5.6427q33.64155,0,53.88349,16.49406t20.242,50.35031v41.09048q-48.46663,0-80.82524,2.45964t-56.30682,7.95766q-23.94822,5.498-36.92017,15.48127a59.32729,59.32729,0,0,0-18.959,24.16236q-5.98706,14.17911-5.98706,35.30309,0,40.22237,27.51194,61.92508T1718.85457,569.47188Zm5.13176-23.43893q-74.69562,0-74.69563-61.92509,0-26.04325,13.82725-39.06489t49.03682-18.51965q35.20959-5.498,105.05855-5.498V431.732q0,49.77156-27.797,82.03627T1723.98633,546.033Zm240.297,16.20469a18.18926,18.18926,0,0,0,11.83179-4.05117,13.41391,13.41391,0,0,0,4.98921-10.996V374.43679a77.27659,77.27659,0,0,1,1.99545-16.34938,91.24958,91.24958,0,0,1,7.55533-20.40055,88.70382,88.70382,0,0,1,13.96979-20.54524q8.41-9.25983,23.09292-15.48127a83.62768,83.62768,0,0,1,32.9288-6.22145q8.5526,0,12.54431-3.7618a12.55379,12.55379,0,0,0,3.99137-9.5492,10.05076,10.05076,0,0,0-2.281-6.36613,31.2749,31.2749,0,0,0-5.98682-5.6427,49.242,49.242,0,0,1-4.84666-3.90649q-34.21175,0-55.02388,17.79623a83.33048,83.33048,0,0,0-27.3694,44.70759l-.57019-33.56687q-.28545-8.10234-5.13176-12.44289a16.9108,16.9108,0,0,0-11.68924-4.34054,16.68277,16.68277,0,0,0-11.26114,4.05117q-4.70411,4.05119-4.70434,11.28542V547.19042q0,7.52361,4.56179,11.28542A17.32755,17.32755,0,0,0,1964.28337,562.23764Zm284.20233,7.23424a116.08214,116.08214,0,0,0,61.15348-16.78343q27.797-16.78344,41.19664-48.03535v41.95858a20.742,20.742,0,0,0,.71274,5.498q.71274,2.60432,4.98921,5.6427t11.689,3.03838a17.67554,17.67554,0,0,0,11.26137-3.47243q4.419-3.47244,4.419-10.41731V167.24819a13.41391,13.41391,0,0,0-4.98921-10.996,18.48018,18.48018,0,0,0-23.09292,0,13.41391,13.41391,0,0,0-4.98921,10.996V333.92506q-10.83372-29.80507-37.918-47.31193a107.533,107.533,0,0,0-59.58544-17.50686q-30.50547,0-55.16643,12.73226a111.233,111.233,0,0,0-39.9137,33.85624,159.6883,159.6883,0,0,0-23.23547,47.31193,187.02172,187.02172,0,0,0-7.98274,54.83553,238.38051,238.38051,0,0,0,4.419,46.73318A167.88339,167.88339,0,0,0,2145.42283,506.1a121.56,121.56,0,0,0,23.66312,33.2775,102.67629,102.67629,0,0,0,34.35429,21.99208Q2223.68219,569.47189,2248.4857,569.47188Zm0-23.43893q-24.23333-.57875-42.337-12.00884a76.81107,76.81107,0,0,1-27.797-30.23912,157.79206,157.79206,0,0,1-14.11234-39.49895,208.07311,208.07311,0,0,1-4.419-43.55012,196.82919,196.82919,0,0,1,5.13176-45.431,160.212,160.212,0,0,1,15.68038-40.8011A80.64862,80.64862,0,0,1,2210.14,303.97531q18.959-11.4301,43.76251-11.4301t43.90507,10.70667a82.78365,82.78365,0,0,1,30.36292,28.79227,140.8954,140.8954,0,0,1,16.82077,39.78832,183.59271,183.59271,0,0,1,5.55941,45.72039,230.23948,230.23948,0,0,1-2.99353,37.90741,144.48869,144.48869,0,0,1-10.40607,34.72435,102.1538,102.1538,0,0,1-18.81646,28.937q-11.40391,12.15351-29.22252,19.53244T2248.4857,546.033Zm334.94951,22.57082q31.93095,0,56.1645-8.68109a83.029,83.029,0,0,0,39.20072-28.5029q14.968-19.82181,14.96787-48.75877a90.7965,90.7965,0,0,0-2.99353-24.16236,67.952,67.952,0,0,0-10.54862-21.41334q-7.55509-10.562-22.23763-18.809t-36.06488-13.45568l-54.73878-13.60037q-37.918-9.25983-48.32408-17.0728t-10.40607-28.35822q0-51.50778,80.11249-51.50778a141.87491,141.87491,0,0,1,20.09939,1.44684,140.37559,140.37559,0,0,1,19.52921,4.19586q9.40823,2.749,15.11018,4.7746t14.11234,5.35334q8.41039,3.32775,9.55078,3.90649a18.78636,18.78636,0,0,0,6.55725,1.15747q5.41651,0,8.41039-3.32775a11.49224,11.49224,0,0,0,2.99352-7.95766q0-7.23423-6.84234-11.28541-13.39961-7.813-39.201-15.04722a200.11909,200.11909,0,0,0-91.94427-3.47243,139.31781,139.31781,0,0,0-34.63916,12.00883,63.0188,63.0188,0,0,0-25.9439,23.873q-9.55078,15.626-9.55078,36.74994a74.47612,74.47612,0,0,0,3.99137,25.46452,53.84167,53.84167,0,0,0,10.26352,17.94091q6.27181,6.94486,17.391,12.58758a137.45064,137.45064,0,0,0,21.38233,8.82577q10.26352,3.18306,26.5141,6.94487l55.87918,13.60037q29.65017,6.94486,41.62428,19.09839t11.97411,34.72435q0,28.3582-20.527,43.55012t-57.58977,15.1919q-47.61133,0-87.23993-25.17515-5.702-4.05119-11.11882-4.05118a11.77627,11.77627,0,0,0-8.55293,3.32775,10.71377,10.71377,0,0,0-3.42118,7.95766q0,6.94488,6.84235,12.15353,14.25489,11.28541,43.19232,20.54524T2583.43521,568.60377Zm314.4227.86811a143.26185,143.26185,0,0,0,52.458-9.5492,133.1321,133.1321,0,0,0,43.62-27.63479q19.10156-18.08559,30.07782-47.16724T3034.99,419.28908q0-35.59247-10.83372-64.52942t-29.65017-47.4566a130.05688,130.05688,0,0,0-43.47742-28.35822,148.46346,148.46346,0,0,0-105.91384-.14469,131.18748,131.18748,0,0,0-43.47742,28.06885q-18.959,18.375-29.79272,47.31193T2761.011,419.28908q0,36.46056,10.97626,65.5422t30.07783,47.31193a132.33466,132.33466,0,0,0,43.47741,27.77947A142.14171,142.14171,0,0,0,2897.85791,569.47188Zm-.5702-23.43893q-47.89644,0-75.40838-35.15841t-27.51194-91.58546q0-57.29519,27.65449-92.01952t75.836-34.72435q48.18153,0,75.97857,35.01372t27.797,91.73015q0,57.00581-27.36939,91.87483T2897.28771,546.033ZM3207.719,569.47188q33.07134,0,58.8727-16.78343t34.35429-47.16724v41.37984q0,7.23424,4.98921,11.28542a17.39539,17.39539,0,0,0,11.26136,4.05117,18.189,18.189,0,0,0,11.83156-4.05117q4.98921-4.05118,4.98922-11.57479V292.25584q0-7.23424-4.70412-11.14073a17.05942,17.05942,0,0,0-11.26136-3.90649,18.523,18.523,0,0,0-11.83156,4.19586,13.23562,13.23562,0,0,0-5.27431,10.85136V457.77523q-4.27647,42.8267-28.08214,65.5422T3211.99551,546.033q-38.77331,0-56.59192-22.8602T3137.585,456.32838V292.25584q0-7.23424-4.84666-11.14073a18.03944,18.03944,0,0,0-11.689-3.90649,17.623,17.623,0,0,0-11.40391,3.90649q-4.84667,3.9065-4.84667,11.14073v163.4938Q3104.79872,569.47189,3207.719,569.47188Zm248.27977-7.23424a18.189,18.189,0,0,0,11.83156-4.05117,13.41391,13.41391,0,0,0,4.98921-10.996V374.43679a77.27754,77.27754,0,0,1,1.99569-16.34938,91.23634,91.23634,0,0,1,7.55509-20.40055,88.70414,88.70414,0,0,1,13.96979-20.54524q8.41039-9.25983,23.09293-15.48127a83.62765,83.62765,0,0,1,32.9288-6.22145q8.55293,0,12.5443-3.7618a12.55379,12.55379,0,0,0,3.99137-9.5492,10.05181,10.05181,0,0,0-2.28078-6.36613,31.28359,31.28359,0,0,0-5.98706-5.6427,49.2433,49.2433,0,0,1-4.84666-3.90649q-34.21175,0-55.02388,17.79623a83.33053,83.33053,0,0,0-27.36939,44.70759l-.5702-33.56687q-.28509-8.10234-5.13176-12.44289a16.91061,16.91061,0,0,0-11.689-4.34054,16.68332,16.68332,0,0,0-11.26136,4.05117q-4.70412,4.05119-4.70412,11.28542V547.19042q0,7.52361,4.56157,11.28542A17.32772,17.32772,0,0,0,3455.99881,562.23764ZM3745.3329,570.34q53.59839,0,85.81445-24.88578,8.838-6.6555,8.838-13.311a9.3607,9.3607,0,0,0-3.56372-7.37893,12.17389,12.17389,0,0,0-8.12529-3.03838,12.36322,12.36322,0,0,0-6.84235,2.02559q-32.50116,22.28145-73.84034,22.28146-21.95253,0-39.20095-8.247t-27.65449-21.124a115.81576,115.81576,0,0,1-17.24842-29.94975,155.79693,155.79693,0,0,1-9.40823-32.84345,196.99571,196.99571,0,0,1-2.56588-31.686q0-61.92508,30.22037-95.926t74.69563-34.00092q36.77763,0,64.71721,21.99209,4.84666,4.6299,10.54862,4.62991a9.9891,9.9891,0,0,0,6.9849-2.45964,8.72177,8.72177,0,0,0,2.70843-6.80019q0-6.36612-5.98706-12.73226-12.5443-12.73225-33.78409-20.25587a129.30881,129.30881,0,0,0-43.47742-7.52361q-63.57681,0-101.49482,41.95859t-37.918,108.51359q0,67.42311,33.35645,109.09232T3745.3329,570.34Zm288.76389-.86811a193.075,193.075,0,0,0,42.19448-4.34054q19.38666-4.34055,33.35645-12.15352a181.91453,181.91453,0,0,0,22.52273-14.46848,157.06464,157.06464,0,0,0,17.10586-15.626q5.98705-6.07675,5.98706-12.73226a10.26112,10.26112,0,0,0-2.851-7.52361,9.94741,9.94741,0,0,0-7.41254-2.89369q-5.41686,0-11.11882,4.91928-21.38233,18.809-43.47742,29.08164t-54.88133,10.27262a103.58214,103.58214,0,0,1-70.13406-29.80507q-14.54-14.17911-23.09293-36.60525t-8.55293-50.20562v-4.62991h209.832q8.55293,0,13.3996-3.32775t4.84666-8.247q-5.98706-142.08045-126.29834-142.08046-41.33918,0-72.5574,21.26867a132.91335,132.91335,0,0,0-46.89859,55.559q-15.68037,34.2903-15.68038,75.67014,0,33.2775,10.97627,61.491t29.36507,46.87786a132.98066,132.98066,0,0,0,42.62213,29.08165A127.17822,127.17822,0,0,0,4034.09679,569.47188Zm97.78856-168.70245h-196.7175a138.47333,138.47333,0,0,1,8.838-40.9458,121.29581,121.29581,0,0,1,20.0994-34.435,89.21193,89.21193,0,0,1,32.0735-24.01767q19.38666-8.82577,42.76468-8.82577,44.47525,0,67.42563,29.66038T4131.88535,400.76943Z" />
                        <path id="Combined-Shape" class="cls-2 fill-[#805ff7]" d="M351.82534,0C546.1331,0,703.65068,159.87771,703.65068,357.09688S546.1331,714.19376,351.82534,714.19376,0,554.316,0,357.09688,157.51756,0,351.82534,0Zm0,60.78245c-161.2341,0-291.94018,132.66449-291.94018,296.31443S190.59124,653.41131,351.82534,653.41131,643.76551,520.74685,643.76551,357.09688,513.05947,60.78245,351.82534,60.78245Z" />
                        <ellipse id="Oval" class="cls-3 fill-[#98fce9]" cx="351.82534" cy="357.09688" rx="52.39952" ry="53.18464" /></g></g></g></g></svg>
              </div>
              <div className="flex items-center justify-end w-full text-base-content">
                <a class="text-base-content text-[.8rem] font-thin" href="boardsource.xyz">boardsource.xyz</a>
                <span className='ml-1'><ShareExternalIcon size={3} /></span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
