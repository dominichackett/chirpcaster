"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import Link from 'next/link'
import { useEthersSigner } from '@/signer/signer'
import WalkieTalkie from '@/components/WalkieTalkie/WalkieTalkie'
import {  PlusCircleIcon, UserGroupIcon} from '@heroicons/react/24/solid';
import { useState ,useRef,useEffect} from 'react';
import Notification from '@/components/Notification/Notification';

export default function Dashboard() {
    const [channels,setChannels] = useState([{channelId:1,name:"Main Channel"},{channelId:2,name:"Family"},{channelId:3,name:"54321123456789009876543211234567890"}])
   const [users,setUers] = useState([{address:1,name:"Dominic Hackett"},{address:2,name:"Dame Dollar"},{address:3,name:'Michael Jordan'}])
 // const signer = useEthersSigner()
 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [selectedFile, setSelectedFile] = useState()
 const [target,setTarget] = useState()
 const filename = useRef()
 const [profileExist,setProfileExist] = useState(false)
 const [gotProfile,setGotProfile] = useState(false)
 const [profile,setProfile] = useState({})
 // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
setShow(false);
};
const saveProfile = ()=>{
  
}

// create a preview as a side effect, whenever selected file is changed
useEffect(() => {
    if (!selectedFile) {
        setPreview(undefined)
        return
    }
  
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        return
    }
  
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
    filename.current = e.target.files[0].name
    setTarget(e.target.files)
  
  }
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>ChirpCaster - Push to Talk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black"
       
     >     <WalkieTalkie  />

         <Header/>

     <section
      id="home"
      className= "  opacity-90 relative  overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
          
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
  <video className="-z-10  absolute top-0 left-0 w-full h-full object-cover bg-top bg-no-repeat " autoPlay loop muted>
    <source src="/videos/chirp2.mp4" type="video/mp4" />
  </video>
      <div className="container  ">
               <div className="flex flex-col min-h-[500px] -mx-4  bg-white flex justify-center items-center ml-5 mr-5 pt-10  pb-10  rounded-xl border border-black">
              
               <div className="w-full mt-10 max-w-4xl mx-auto bg-white rounded-md shadow-xl p-6">

               <div className="flex items-center mb-6">
          <div >
            <div className="font-bold text-xl text-gray-900">Channels</div>
          </div>
        </div>
               <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
       
        


          <div className="w-full bg-white p-4 rounded-md shadow-lg flex flex-col items-center col-span-3">
            <PlusCircleIcon className="h-12 w-12 text-green-500" />
            
              <span className="block text-sm font-semibold text-gray-700">Add Channel</span>
             
           
              <div className="w-full mt-2">
              <div className="flex items-center ">
                <input
                  type="text"
                  id='channel'
                  className=" block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Channel"
                />
                <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 ml-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Add
                </button>
              </div>
            </div>

            <div className="w-full mt-2">
              <div className="flex items-center ">
              <select 
            className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
            >
  {channels.map((channel) => (
    <option key={channel.channelId} value={channel.channelId}>
      {channel.name}
    </option>
  ))}
</select>
                
              </div>
            </div>
            
          </div>

          <div className="w-full bg-white p-4 rounded-md shadow-lg flex flex-col items-center col-span-3">
            <UserGroupIcon className="h-12 w-12 text-green-500" />
            
              <span className="block text-sm font-semibold text-gray-700">Add Channel User</span>
             
           
              <div className="w-full mt-2">
              <div className="flex items-center ">
                <input
                  type="text"
                  id='user'
                  className=" block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="User Address"
                />
                <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 ml-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Add
                </button>
              </div>
            </div>

            <div className="w-full mt-2">
              <div className="flex items-center ">
              <select 
            className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
            >
  {users.map((user) => (
    <option key={user.address} value={user.address}>
      {user.name}
    </option>
  ))}
</select>
                
              </div>
            </div>
            
          </div>
     
        </div>
    </div>

    <div className=" w-full mt-10 max-w-4xl mx-auto bg-white rounded-md shadow-xl p-2 ">

<div className="w-full flex-col flex items-center mb-6">
<div className='w-full' >
<div className="font-bold text-xl text-gray-900">User Profile</div>
<div
          className= "mt-6 w-full relative  overflow-hidden rounded-xl bg-bg-color"
        >       
        <form className="p-2 sm:p-10"  onSubmit={ saveProfile}>
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
              <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                    <input
                      disabled={isSaving }
                      required={!selectedFile ? true: false}
                      type="file"
                      name="eventImage"
                      id="eventImage"
                      className="sr-only"
                      onChange={onSelectFile}
                    />
                    <label
                      for="eventImage"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={preview ? preview: '/images/profile.jpg'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2 ">
                    <button disabled={isSaving }
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Save Profile 
                                           </button>
                   
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-5 pt-2">
                    <p className="text-xl font-bold text-white">
                      Profile Details
                    </p>
                  </div>
                  <div className="mb-5">
                        <label
                          for="name"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Name
                        </label>
                        <input
                        disabled={isSaving }
                          required   
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter Name"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>                  <div className="-mx-3 flex flex-wrap">
                   

                  </div>

               
                
     
     
              
             
                 
                  <div className="mb-5">
                    <label
                      for="description"
                      className="mb-2 block text-base font-medium text-white"
                    >
                      Description
                    </label>
                    <textarea
                      disabled={isSaving }
                      required
                      rows="10"
                      name="description"
                      id="description"
                      placeholder="Type profile description"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                    ></textarea>
                  </div>
             
                 
                 
                </div>
              </div>
            </div>
          </form>
        </div>
</div>
</div>

</div>
   
    </div>

    
      </div>


    </section>
    <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />

    <Footer />

     </main>

     </>
  )
}
