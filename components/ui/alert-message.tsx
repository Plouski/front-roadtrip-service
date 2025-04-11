import React from "react"

type AlertProps = {
  message: string
  type: "success" | "error"
}

export const AlertMessage: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div
      className={`top-4 p-4 rounded-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      <p>{message}</p>
    </div>
  )
}
