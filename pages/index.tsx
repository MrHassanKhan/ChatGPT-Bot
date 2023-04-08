// pages/index.tsx

import { NextPage } from "next";
import Link from "next/link";


const HomePage: NextPage = () => {
  return (
    <div className="hero min-h-screen bg-base-200 text-white">
    <div className="hero-content text-center">
      <div className="max-w-md flex flex-col gap-5">
        <h2 className="text-4xl font-bold">Welcome to the Answer Bot</h2>
        <div className="max-w-xl text-xs flex flex-col gap-2">
            <p><sup>*</sup>Actually, I am currently only trained on the following documentation:</p>
            <ul className="flex flex-col gap-2">
              <li><a target="_blank" href="">https://beta.reactjs.org/</a></li>
              <li><a target="_blank" href="">https://supabase.com/docs</a></li>
              <li><a target="_blank" href="">https://tailwindcss.com/docs</a></li>
              <li><a target="_blank" href="">https://nextjs.org/docs</a></li>
              <li><a target="_blank" href="">https://beta.nextjs.org/docs</a></li>
            </ul>
        </div>
        <Link className="btn btn-primary" href="/docs" >Search</Link>
      </div>
    </div>
  </div>
  );
};

export default HomePage;
