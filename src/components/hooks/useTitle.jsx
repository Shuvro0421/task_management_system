import { useEffect } from "react"

const useTitle = (title) => {
    useEffect(() => {
        document.title = `Task Management System | ${title}`;
    }, [title])
}

export default useTitle;