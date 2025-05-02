import Task from "../models/Task.js";

export const getTasks=async(req,res)=>{
      try {
        const {status}=req.query;
        let filter={};

        if(status){
           filter.status=status;
        }

        let tasks;

        if(req.user.role === "admin"){
           tasks=await Task.find(filter).populate(
            "assignedTo",
            "name email profileImageUrl"
           );
        }
        else{
          tasks=await Task.find({...filter,assignedTo:req.user._id}).populate(
            "assignedTo",
            "name email profileImageUrl"
          );
        }

        tasks=await Promise.all(
          tasks.map(async(task)=>{
            const completedCount=task.todoChecklist.filter(
              (item)=>item.completed
            ).length;
            return {...task._doc,completedTodocount:completedCount};
          })
        );

        const allTasks=await Task.countDocuments(
          req.user.role==="admin"?{}:{assignedTo:req.user._id}
        );

        const pendingTasks=await Task.countDocuments({
          ...filter,
          status:"Pending",
          ...(req.user.role !== "admin" && {assignedTo:req.user._id}),
        });

        const inProgressTasks=await Task.countDocuments({
          ...filter,
          status:"In Progress",
          ...(req.user.role !== "admin" && {assignedTo:req.user._id}),
        });
        
        const completedTasks=await Task.countDocuments({
          ...filter,
          status:"Completed",
          ...(req.user.role !== "admin" && {assignedTo:req.user._id}),
        });

        res.json({
          tasks,
          statusSummary:{
            all:allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
          },
        });

      } catch (error) {
        res.status(500).json({message:"server error",error:error.message});
      }
  
}

export const getTasksById = async (req, res) => {
  try {
    const { id } = req.params; // get task id from URL params

    const task = await Task.findById(id).populate('assignedTo', 'name email'); // populate assigned user details if needed

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
      const {
          title,
          description,
          priority,
          dueDate,
          assignedTo,
          attachments,
          todoChecklist,
      } = req.body;

      if (!Array.isArray(assignedTo)) {
          return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
      }

      const task = await Task.create({
          title,
          description,
          priority,
          dueDate,
          assignedTo,
          createdBy: req.user._id,
          todoChecklist,
          attachments,
      });

      res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
      res.status(500).json({ message: "server error", error: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update fields manually
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.attachments = req.body.attachments || task.attachments;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
  
    if(req.body.assignedTo){
        if(!Array.isArray(req.body.assignedTo)){
            return res.status(400).json({message:"assigned to must be an array of user IDs"});
        }
        task.assignedTo=req.body.assignedTo;
    }
    const updatedTask = await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      updatedTask,
    });
    
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;  // Extract task ID from URL params

    // Check if the task exists
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete the task
    await task.deleteOne(); // Remove the task from the database

    // Send success response
    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateTaskStatus=async(req,res)=>{
    try {
        
    } catch (error) {
      res.status(500).json({message:"server error",error:error.message});
    }
}

export const updateTaskChecklist=async(req,res)=>{
    try {
        
    } catch (error) {
      res.status(500).json({message:"server error",error:error.message});
    }
}

export const getDashboardData=async(req,res)=>{
    try {
        
    } catch (error) {
      res.status(500).json({message:"server error",error:error.message});
    }
}

export const getUserDashboardData=async(req,res)=>{
    try {
        
    } catch (error) {
      res.status(500).json({message:"server error",error:error.message});
    }
}