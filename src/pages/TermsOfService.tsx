import React from 'react';

const TermsOfService: React.FC = () => {
    return (
        <div>
            <div className="md:max-w-4xl mx-auto py-5 md:px-5 mt-27">
                <div className="bg-zinc-900 text-white w-full sm:rounded-3xl shadow-lg shadow-black/20 p-8 md:px-16 md:pb-16 text-left">

                    <h2 className="text-2xl text-center font-bold mb-4">Terms of Service</h2>

                    <h3 className="text-xl font-semibold mt-6">You May:</h3>
                    <ul className="list-disc list-inside m-4">
                        <li>Use the avatar in VRChat, Resonite, or similar compatible platforms.</li>
                        <li>Use the avatar for VTubing, including games like Beat Saber.</li>
                        <li>Modify the avatar for personal use. For commercial use of the base itself, contact the base creator.</li>
                        <li>Sell custom commissions using the avatar.
                            <ul className="list-disc list-inside ml-8">
                                <li>You may share Substance Painter (.SPP) and Blender files only to complete an active commission.</li>
                                <li>These files must not be reused or redistributed once the work is done.</li>
                                <li>Model files (including .FBX, .blend, .OBJ, or similar) must not be shared unless both parties legally own the avatar.</li>
                                <li>You may help with project setup to make it upload-ready.</li>
                            </ul>
                        </li>
                        <li>Create and sell your own accessories for the avatar.
                            <ul className="list-disc list-inside ml-8">
                                <li>You may include bone or rigging data only necessary for compatibility, but no part of the base mesh or avatar model may be included.</li>
                            </ul>
                        </li>
                        <li>Create and share renders, illustrations, or artwork based on or using the avatar.</li>
                        <li>Create and sell drawings, fursonas, or fursuits inspired by the avatar, as long as the work is original and not traced or stolen.</li>
                        <li>You may upload public and private avatars made from this base. Public avatars may be used to advertise retextures, commissions, or services, and can be placed in worlds for others to use.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6">You May Not:</h3>
                    <ul className="list-disc list-inside m-4">
                        <li>Use the avatar base for direct commercial products without explicit permission (e.g., in games or commercial media).</li>
                        <li>Claim credit for creating the avatar base.</li>
                        <li>Share, sell, or redistribute the avatar model files (modified or not) is strictly prohibited.
                            <ul className="list-disc list-inside ml-8">
                                <li>Exception: Temporary sharing of .SPP or Blender files is allowed only for active commissions and only if both parties own the avatar.</li>
                            </ul>
                        </li>
                        <li>Use third-party assets with the avatar unless both parties own them legally and the assets follow similar terms.</li>
                        <li>Include the base model mesh in any distributed files, even for accessory compatibility. Bones/rigging may be included where necessary.</li>
                        <li>Use the avatar in any context that promotes or involves illegal, unethical, or discriminatory behavior (sexism, racism, homophobia, transphobia, etc.).</li>
                        <li>Proceed with any use not explicitly covered in this document without first contacting the creator for permission.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6">Additional Notes:</h3>
                    <ul className="list-disc list-inside m-4">
                        <li>The creator retains full credit for the avatar base, regardless of any modifications.</li>
                        <li>The creator is not responsible for inappropriate or unauthorized usage.</li>
                        <li>The creator may use the avatar for advertising or commercial purposes.</li>
                        <li>If you'd like to create and sell your own version of this avatar, you must contact the base creator.</li>
                        <li>All future updates to the avatar are provided free of charge to clients who already own the product.</li>
                        <li>These terms may change at any time without notice.</li>
                        <li>This is a digital item—all sales are final and non-refundable.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
