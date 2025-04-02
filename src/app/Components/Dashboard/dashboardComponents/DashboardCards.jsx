"use client"

const DashboardCards = () =>{
    return  <div className="flex gap-4">
     <div  className="h-40 w-64 rounded-lg border-gray-700 border-double shadow-sm shadow-gray-400 bg-white">
     <p className="text-center py-2">Not Started</p>
    </div> 
    <div  className="h-40 w-64 rounded-lg  border-gray-700 border-double shadow-sm shadow-gray-400 bg-white">
     <p className="text-center py-2">In Progress</p>
    </div> 
    <div  className="h-40 w-64 rounded-lg border-gray-700 border-double shadow-sm shadow-gray-400 bg-white">
     <p className="text-center py-2">Completed</p>
    </div>   
</div>
       
}

export default DashboardCards;