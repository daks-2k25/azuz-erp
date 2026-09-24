const MOUNT_CLASS = "contract-print-mount";
const BODY_CLASS = "printing-contract";

export function printContractFromElement(source: HTMLElement | null) {
  if (!source) return false;

  document
    .querySelectorAll(`.${MOUNT_CLASS}`)
    .forEach((node) => node.remove());

  const mount = document.createElement("div");
  mount.className = MOUNT_CLASS;
  mount.setAttribute("data-contract-print-mount", "true");
  mount.appendChild(source.cloneNode(true));
  document.body.appendChild(mount);
  document.body.classList.add(BODY_CLASS);

  const cleanup = () => {
    mount.remove();
    document.body.classList.remove(BODY_CLASS);
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup);

  window.print();
  return true;
}
