import { Router, Routes, Route, Link } from "solid-app-router";
import Separator from './separator/separator'

export default function Navigation() {
    return (
        <div className="navigation flex flex-col flex-1 mt-6">
            {/* when finalized navlink has a custom class in index.css */}
            <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/'>HOME</Link>
            <Separator title='Mapping' />
            <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html'>KEYMAP</Link>
            <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/led'>LED</Link>
            <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/oled'>OLED</Link>
            <Separator title='Tools' />
            <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/tester'>TESTER</Link>
            <Separator title='Settings' />
            <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/options'>OPTIONS</Link>
            <Link class="text-gray-600 text-sm mb-1 hover:text-purple-500" href='/index.html/account'>ACCOUNT</Link>
        </div>
    )
}
