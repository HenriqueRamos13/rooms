import { FormEvent, Fragment, useState } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { CollectionIcon, SearchIcon } from "@heroicons/react/solid";
import { classNames } from "../../utils/classNames";
import { useRouter } from "next/router";
import { useAuth } from "../../utils/contexts/Auth";
import { ToastContainer, toast } from "react-toastify";

const userNavigation = [
  { name: "Meus Quartos", href: "/perfil/quartos" },
  // { name: "Settings", href: "#" },
];

interface Props {
  children: React.ReactNode;
}

const BaseLayout: React.FC<Props> = ({ children }) => {
  const [navigation, setNavigation] = useState<
    {
      name: string;
      href: string;
      current: boolean;
    }[]
  >([
    { name: "Encontrar Quartos", href: "/", current: true },
    { name: "Sobre nós", href: "/sobre", current: false },
    { name: "Quero publicar um quarto", href: "/publicar", current: false },
  ]);

  const router = useRouter();
  const { login, logout, user } = useAuth();
  const [modal, setModal] = useState<any>(false);

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());

    login(formData)
      .then(() => {
        toast("Verifique seu e-mail para iniciar a sessão.", {
          type: "success",
        });

        setModal(false);
      })
      .catch((message) => {
        toast(message, {
          type: "error",
        });
      });
  };

  const onRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      toast("Verifique seu e-mail para confirmar a conta.", {
        type: "success",
      });

      setModal(false);
    } else {
      toast(data.message, {
        type: "error",
      });
    }
  };

  const handleRoute = (route: string) => {
    router.replace(route);
    setNavigation(
      Object.assign(
        [],
        [
          ...navigation.map((item) => ({
            ...item,
            current: item.href === route,
          })),
        ]
      )
    );
  };

  return (
    <>
      <div className="min-h-full bg-gray-100">
        <Popover
          as="header"
          className="h-[70px] md:h-auto py-4 lg:pb-24 bg-indigo-600"
        >
          {({ open }) => (
            <>
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="relative py-5 flex items-center justify-center lg:justify-between">
                  {/* Logo */}
                  <div className="absolute left-0 flex-shrink-0 lg:static">
                    <a href="#">
                      <span className="sr-only">Workflow</span>
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=300"
                        alt="Workflow"
                      />
                    </a>
                  </div>

                  {/* Right section on desktop */}
                  <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                    {/* Profile dropdown */}
                    {user ? (
                      <Menu as="div" className="ml-4 relative flex-shrink-0">
                        <div className="grid grid-cols-2 gap-4">
                          <p className="text-gray-300">Olá, {user.name}</p>
                          <Menu.Button>
                            <CollectionIcon
                              width={24}
                              height={24}
                              className="text-gray-300"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right z-40 absolute -right-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <p
                                    key={item.name}
                                    onClick={() => handleRoute(item.href)}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                    )}
                                  >
                                    {item.name}
                                  </p>
                                )}
                              </Menu.Item>
                            ))}
                            <Menu.Item>
                              <button
                                onClick={() => logout()}
                                className="ml-2 block rounded-md px-3 py-2 text-base text-red-400 font-medium hover:bg-gray-100 hover:text-gray-800"
                              >
                                Encerrar Sessão
                              </button>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 px-4">
                        <button
                          onClick={() => setModal({ type: "Registro" })}
                          className="btn btn-ghost text-gray-200"
                        >
                          Criar Conta
                        </button>
                        <button
                          onClick={() => setModal({ type: "Login" })}
                          className="btn btn-secondary"
                        >
                          Iniciar Sessão
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Search */}
                  {/* <div className="flex-1 min-w-0 px-12 lg:hidden">
                    <div className="max-w-xs w-full mx-auto">
                      <label htmlFor="desktop-search" className="sr-only">
                        Search Anime, Manga...
                      </label>
                      <div className="relative text-white focus-within:text-gray-600">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <SearchIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <input
                          id="desktop-search"
                          className="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Search Anime, Manga..."
                          type="search"
                          name="search"
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* Menu button */}
                  <div className="absolute right-0 flex-shrink-0 lg:hidden">
                    {/* Mobile menu button */}
                    <Popover.Button className="bg-transparent p-2 rounded-md inline-flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Popover.Button>
                  </div>
                </div>
                <div className="hidden lg:block border-t border-white border-opacity-20 py-5">
                  <div className="grid grid-cols-3 gap-8 items-center">
                    <div className="col-span-2">
                      <nav className="flex space-x-4">
                        {navigation.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleRoute(item.href)}
                            className={classNames(
                              item.current ? "text-white" : "text-indigo-100",
                              "text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10"
                            )}
                          >
                            {item.name}
                          </button>
                        ))}
                      </nav>
                    </div>
                    {/* <div>
                      <div className="max-w-md w-full mx-auto">
                        <label htmlFor="mobile-search" className="sr-only">
                          Search Anime, Manga...
                        </label>
                        <div className="relative text-white focus-within:text-gray-600">
                          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <SearchIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="mobile-search"
                            className="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Search Anime, Manga..."
                            type="search"
                            name="search"
                          />
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <Transition.Root as={Fragment}>
                <div className="lg:hidden">
                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="z-20 fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Popover.Panel
                      focus
                      className="z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top"
                    >
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
                        <div className="pt-3 pb-2">
                          <div className="flex items-center justify-between px-4">
                            <div>
                              <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                                alt="Workflow"
                              />
                            </div>
                            <div className="-mr-2">
                              <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                <span className="sr-only">Close menu</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                              </Popover.Button>
                            </div>
                          </div>
                          <div className="mt-3 px-2 space-y-1">
                            {navigation.map((item) => (
                              <button
                                key={item.name}
                                onClick={() => handleRoute(item.href)}
                                className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 pb-2">
                          {user ? (
                            <>
                              <div className="flex items-center px-5">
                                <div className="ml-3 min-w-0 flex-1">
                                  <div className="text-base font-medium text-gray-800 truncate">
                                    <p className="text-gray-800">
                                      Olá, {user.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 px-2 space-y-1">
                                {userNavigation.map((item) => (
                                  <p
                                    key={item.name}
                                    onClick={() => handleRoute(item.href)}
                                    className="cursor-pointer block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                                  >
                                    {item.name}
                                  </p>
                                ))}
                                <button
                                  onClick={() => logout()}
                                  className="block rounded-md px-3 py-2 text-base text-red-400 font-medium hover:bg-gray-100 hover:text-gray-800"
                                >
                                  Encerrar Sessão
                                </button>
                              </div>{" "}
                            </>
                          ) : (
                            <div className="grid grid-cols-2 gap-4 px-4">
                              <button
                                onClick={() => setModal({ type: "Registro" })}
                                className="btn btn-ghost text-gray-200"
                              >
                                Criar Conta
                              </button>
                              <button
                                onClick={() => setModal({ type: "Login" })}
                                className="btn btn-secondary"
                              >
                                Iniciar Sessão
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </>
          )}
        </Popover>
        <main className="mt-12 lg:-mt-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {children}
          </div>
        </main>
        <footer>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="border-t border-gray-200 py-8 text-sm text-gray-500 text-center sm:text-left">
              <span className="block sm:inline">
                &copy; 2021 Tailwind Labs Inc.
              </span>{" "}
              <span
                className="block sm:inline link"
                onClick={() => router.push("/legal")}
              >
                All rights reserved.
              </span>
            </div>
          </div>
        </footer>
      </div>

      <div className={classNames("modal", modal ? "modal-open" : "")}>
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setModal(null)}
          >
            ✕
          </label>
          <h3 className="text-3xl font-bold">{modal?.type || ""}</h3>
          <form onSubmit={modal?.type === "Login" ? onLogin : onRegister}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="Email"
                name="email"
                className="input input-bordered"
              />
            </div>
            {modal?.type === "Registro" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nome</span>
                </label>
                <input
                  type="text"
                  placeholder="Nome"
                  name="name"
                  className="input input-bordered"
                />
              </div>
            )}
            <p className="mt-4">
              {modal?.type === "Login"
                ? "Um e-mail com a url de acesso será enviado para você."
                : modal?.type === "Registro"
                ? "Por segurança, não pedimos senha. Apenas e-mail, sempre que fizer login um e-mail com a url de acesso será enviado para você."
                : ""}
            </p>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">
                {modal?.type === "Login"
                  ? "Iniciar Sessão"
                  : modal?.type === "Registro"
                  ? "Efetuar Registro"
                  : ""}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
