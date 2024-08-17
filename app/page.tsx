'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
export default function Home() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    registrationNumber: '',
    password: '',
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
}

// const {setUser} = useUser();

// const handleSignIn = async () => {
//     try{
//         const response = await axios.post('http://localhost:8000/api/v1/login-user',{
//             registrationNumber: formData.registrationNumber,
//             password: formData.password,
//         })

//         if(response.status === 200 || response.data.success){
//             localStorage.setItem('token', response.data.token)
//             setUser(response.data.user)
//             router.push('/dashboard');
//         }
//         else{
//             alert('Invalid credentials')
//         }
//     }
//     catch(error){
//         console.error('Error during sign in:', error);
//         alert('An error occurred. Please try again.');
//     }
// }
  
  return (
    <div className='w-full h-screen flex justify-center items-center'>
            <div className="w-[830px] h-[640px] flex flex-col justify-center items-center gap-[42px]">
                <div className="self-stretch h-[25px] text-center text-black text-[32px] font-bold font-['Inter']">Sign in</div>
                
                <Image className="w-[273px] h-60" src="/./SignIn.png" alt='sign in image' width={380} height={380}  />
                <div className="self-stretch flex flex-col justify-center items-center gap-[20px]">
                    <div className="flex gap-[86px]">
                        <div className="h-[68px] relative">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Index</label>
                            <input type="text" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="EG/XXXX/XXXX" />
                        </div>
                        <div className="h-[68px] relative">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="Password" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-full mt-4">
                        <div className="flex items-center">
                            <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember Me</label>
                        </div>
                        <div className="flex items-center">
                            <div className="w-[169px] h-4 text-black text-xl font-medium font-['Inter'] cursor-pointer">Forgot Password ?</div>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"

                >
                    Sign in
                </button>
                <div className="flex flex-row items-center gap-2">
                    <div className="text-black text-xl font-light font-['Inter']">Don&apos;t have an account?</div>
                    <button
                        className="text-blue-500 hover:underline text-xl font-bold font-['Inter']"
                    >
                        Ask Administrator
                    </button>
                </div>
            </div>
        </div>
  );
}
