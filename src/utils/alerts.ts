import Swal from "sweetalert2";

interface AlertProps {
  title: string;
  icon: "success" | "error" | "warning" | "info" | "question";
}

export function emitAlert({ title, icon }: AlertProps) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: icon,
    title: title
  })
}