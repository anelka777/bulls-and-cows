type Child = Node | string;

type Props = {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
  on?: Record<string, EventListener>;
};

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (props.className) {
    node.className = props.className;
  }
  if (props.text !== undefined) {
    node.textContent = props.text;
  }
  Object.entries(props.attrs ?? {}).forEach(([name, value]) =>
    node.setAttribute(name, value),
  );
  Object.entries(props.on ?? {}).forEach(([type, handler]) =>
    node.addEventListener(type, handler),
  );
  node.append(...children);
  return node;
};
