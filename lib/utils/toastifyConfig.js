import { Bounce, Slide } from 'react-toastify';

const toastSuccess = {
    className: "bg-arsenic text-cultured font-body w-auto px-[40px] text-center rounded",
    position: "top-center",
    autoClose: 2500,
    limit: 1,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: false,
    newestOnTop: true,
    theme: "dark",
    transition: Slide,
    icon: false,
};

const toastError = {
    className: "bg-arsenic text-red-400 font-body w-auto px-[40px] text-center rounded",
    position: "top-center",
    autoClose: 5000,
    limit: 1,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: false,
    newestOnTop: true,
    theme: "dark",
    transition: Bounce,
    icon: false,
};

const toastWarning = {
    className: "bg-arsenic text-cultured font-body w-auto px-[40px] text-center rounded",
    position: "bottom-right",
    autoClose: 2500,
    limit: 1,
    hideProgressBar: true,
    pauseOnHover: true,
    draggable: false,
    newestOnTop: true,
    theme: "dark",
    transition: Slide,
    icon: false,
};

const toastInfo = {
    className: "bg-arsenic text-cultured font-body w-auto px-[40px] text-center rounded",
    position: "bottom-right",
    autoClose: 2500,
    limit: 1,
    hideProgressBar: true,
    pauseOnHover: true,
    draggable: false,
    newestOnTop: true,
    theme: "dark",
    transition: Slide,
    icon: false,
};

const toastLoading = {
    className: "bg-arsenic text-cultured font-body w-auto px-[40px] text-center rounded",
    position: "top-center",
    autoClose: 2500,
    limit: 1,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: false,
    newestOnTop: true,
    theme: "dark",
    transition: Slide,
    icon: false,
};

export { toastSuccess, toastError, toastWarning, toastInfo, toastLoading }