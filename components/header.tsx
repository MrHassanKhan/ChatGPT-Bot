import Link from "next/link";

const Header = () => {
    return (
        <div className="navbar bg-base-100 text-white fixed top-0">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">ChatGPT 3.5 Answer Bot</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/embeddings" >Create Embeddings</Link></li>
            <li><Link href="/docs" >Search</Link></li>
          </ul>
        </div>
      </div>
    )
}

export default Header;