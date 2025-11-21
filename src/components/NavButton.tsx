import {type ReactNode} from 'react';

import {useNavigate} from 'react-router-dom';

import Button from 'react-bootstrap/Button';

interface ButtonProps{
  // Link for button to navigate to.
  href: string;
  // Text to display on button.
  children: ReactNode;
  // Optional CSS class name.
  className?: string;
  // react-bootstrap variant to use. Defaults to primary.
  variant?: string;
}

export default function NavButton(props: ButtonProps){
  const navigate = useNavigate();

  return(
    <Button
      className={props.className}
      variant={props.variant ?? "primary"}
      onClick={() => navigate(props.href)}
    >
      {props.children}
    </Button>
  );
}