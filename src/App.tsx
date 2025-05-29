import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { type TaskType, type TabType, type MenuButtonType } from "./type/todo";

const App = () => {
  const todoData: TaskType[] = JSON.parse(localStorage.getItem("todos") || "[]");

  const [getData, setData] = useState<TaskType[]>(() =>
    Array.isArray(todoData) ? todoData : []
  );
  const [newTitle, setNewTitle] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [saveddata, setSavedData] = useState<TaskType[]>([]);

  useEffect(() => {
    let newData: TaskType[];
    if (activeTab === "All") {
      newData = getData;
    } else if (activeTab === "To Do") {
      newData = getData.filter((task) => task.completed === false);
    } else {
      newData = getData.filter((task) => task.completed === true);
    }
    setSavedData(newData);
  }, [activeTab, getData]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const id = Math.floor(100000 + Math.random() * 900000);

    const newTitleName = newTitle
      .split(" ")
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join(" ");

    const newData: TaskType = {
      id,
      title: newTitleName,
      completed: false,
    };

    setData((prev) => {
      const updated = [newData, ...prev];
      localStorage.setItem("todos", JSON.stringify(updated));
      return updated;
    });
    setNewTitle("");
  };

  const onDelete = (id: number) => {
    const filteredData = getData.filter((task) => task.id !== id);
    setData(filteredData);
    localStorage.setItem("todos", JSON.stringify(filteredData));
  };

  const onUpdate = (id: number) => {
    const newDatas = getData.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setData(newDatas);
    localStorage.setItem("todos", JSON.stringify(newDatas));
  };

  const menuButtons: MenuButtonType[] = [
    { name: "All" },
    { name: "To Do" },
    { name: "Completed" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-bl from-violet-500 to-fuchsia-500 p-5 sm:pt-10">
      <div className="bg-white max-w-2xl w-full px-7 sm:px-10 pt-10 pb-5 rounded-sm mx-auto">
        <div className="flex flex-col items-center ">
          <h1 className="font-bold text-3xl text-gray-800 mb-5">Simple ToDo List</h1>
          <form onSubmit={onSubmit} className="w-full">
            <div className="w-full sm:flex sm:relative">
              <input
                type="text"
                name="newTitle"
                value={newTitle}
                placeholder="Add New List"
                className="w-full text-lg outline-none px-3 py-1 rounded-md bg-gray-200 border-1 border-purple-400 sm:pr-20"
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                className="bg-purple-500 text-white sm:px-5 sm:absolute rounded-sm sm:h-full right-0 cursor-pointer hover:bg-purple-600 transition-all ease-in-out py-1 sm:mt-0 mt-1 sm:w-fit w-full "
              >
                Add
              </button>
            </div>
          </form>

          <div className="w-full mt-5 relative">
            <div className="w-full flex justify-center mb-5">
              <div className="flex border-1 border-purple-500 rounded-sm">
                {menuButtons.map((button, index) => (
                  <button
                    key={index}
                    className={`sm:px-5 px-4 py-2 ${
                      activeTab === button.name ? "bg-purple-500 text-white" : ""
                    }`}
                    onClick={() => setActiveTab(button.name)}
                  >
                    {button.name}
                  </button>
                ))}
              </div>
            </div>

            {
              saveddata.length > 0 ? (
                <ul className="w-full space-y-1">
              {saveddata
                .sort((a, b) => Number(a.completed) - Number(b.completed))
                .map((task) => (
                  <li
                    key={task.id}
                    className="bg-gray-100 border-1 text-md border-purple-400 rounded-sm py-2 px-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        <div
                          className="border-1 p-0.5 rounded-full border-purple-500 cursor-pointer"
                          onClick={() => onUpdate(task.id)}
                        >
                          <div
                            className={`${
                              task.completed ? "bg-purple-500" : ""
                            } p-1`}
                          ></div>
                        </div>
                      </span>
                      <span
                        className={`cursor-pointer select-none ${
                          task.completed ? "line-through" : ""
                        }`}
                        onClick={() => onUpdate(task.id)}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div>
                      <button>
                        <Trash
                          size={15}
                          className="text-red-600 hover:text-red-700 hover:scale-140 active:scale-140 active:rotate-10 transition-all ease-in-out hover:rotate-10 cursor-pointer"
                          onClick={() => onDelete(task.id)}
                        />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
              ) : 
              (
                <div className="border-2 w-full h-32 rounded-md border-dashed border-gray-400 flex justify-center items-center">
                  <span className="translate-y-[-40%] text-gray-400">No List</span>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
