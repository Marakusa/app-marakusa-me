import { Link } from "react-router-dom";

function Docs() {
    return (
        <div className="md:max-w-4xl mx-auto py-5 md:px-5 my-27">
            <div className="bg-zinc-900 text-white w-full sm:rounded-3xl shadow-lg shadow-black/20 p-8 md:px-16 md:pb-16 text-left">

                <h2 className="text-2xl text-center font-bold mb-4">Documentation</h2>

                <div className="grid sm:grid-cols-2 gap-4">

                    <div className="bg-zinc-800/50 p-6 rounded-3xl mb-4 gap-2 flex flex-col h-fit">
                        <div>
                            <Link to="/docs/faq" className="text-blue-400 hover:underline font-bold">FAQ</Link>
                            <p className="text-sm text-zinc-400">Frequently Asked Questions</p>
                        </div>
                        <div>
                            <Link to="/tos" className="text-blue-400 hover:underline font-bold">Terms of Service</Link>
                            <p className="text-sm text-zinc-400">Terms of Service</p>
                        </div>
                    </div>

                    <div className="bg-zinc-800/50 p-6 rounded-3xl mb-4 gap-2 flex flex-col h-fit">
                        <div>
                            <Link to="/resources" className="text-blue-400 hover:underline font-bold">Resources</Link>
                            <p className="text-sm text-zinc-400">Required packages for uploading</p>
                        </div>
                        <div>
                            <Link to="/tutorial/redeem" className="text-blue-400 hover:underline font-bold">How do I redeem my purchase?</Link>
                            <p className="text-sm text-zinc-400">How to redeem your purchases</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Docs;