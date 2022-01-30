import './sidebar.sass'
import { Show, createState, createSignal, onMount } from "solid-js";

export default function Sidebar() {
    return (
        <div className="sidebar p-6 flex-col h-full bg-purple-500">
            <div className="sidebar__logo text-center center"><p>logo here</p></div>
            <p class="text-4xl text-red-400 tracking-widest">hi</p>
        </div>
    );
}