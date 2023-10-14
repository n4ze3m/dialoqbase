const ApiPlaygroundComponent: React.FC = () => {
    return (
        <div className=" min-h-screen ">
        <div className="border rounded-md p-4 max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold mb-4">POST /chat/completions</h1>
  
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">LEFT PANEL</h2>
              {/* Content of left panel */}
            </div>
  
            <div className="border rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">RIGHT PANEL</h2>
              {/* Content of right panel */}
            </div>
          </div>
        </div>
      </div>
    )
}


export default ApiPlaygroundComponent;