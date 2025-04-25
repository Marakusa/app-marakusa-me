import { FaLink } from "react-icons/fa6";
import { Link } from "react-router-dom";

const questions = [
    {
        question: "How do I redeem my license keys?",
        answer: "You can redeem license keys in the Licenses page.",
    },
    {
        question: "How can I find the files from the older versions of the assets?",
        answer: (
            <>
                In Library page click <strong>Archived</strong> on the side panel, or{" "}
                <Link to="/archived" className="text-blue-400 hover:underline inline-block font-bold">
                    click this link
                </Link>.
            </>
        ),
    },
];

function Faq() {
    return (
        <div className="md:max-w-4xl mx-auto py-5 md:px-5 my-27">
            <div className="bg-zinc-900 text-white w-full sm:rounded-3xl shadow-lg shadow-black/20 p-8 md:px-16 md:pb-16 text-left">

                <h2 className="text-2xl text-center font-bold mb-4">Frequently Asked Questions</h2>
                <p>If you have any questions, feel free to contact me through Discord or Twitter.</p>
                <a
                    href="https://discord.gg/47SrTE3Spw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                >
                    <FaLink className="w-5 h-5 min-w-5" /> Discord Server
                </a>
                <a
                    href="https://twitter.com/Marakusa_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                >
                    <FaLink className="w-5 h-5 min-w-5" /> Twitter
                </a>

                <div className="gap-4 flex flex-col mt-8">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-zinc-800/50 p-6 rounded-3xl gap-2 flex flex-col h-fit">
                            <p className="text-lg font-black">{q.question}</p>
                            <p>{q.answer}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Faq;