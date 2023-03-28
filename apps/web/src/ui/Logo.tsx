type LogoProps = Omit<React.SVGProps<SVGSVGElement>, "width" | "height">;

const Logo = ({ ...props }: LogoProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 716 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_214_2)">
        <path
          d="M0 180.895V68.1289H71.2053V80.3964H14.2411V116.605H65.6258V128.577H14.2411V168.628H72.5263V180.895H0ZM81.3351 111.136V99.4611H94.6952V88.2287C94.6952 80.0513 96.7017 73.9917 100.715 70.0509C104.826 66.109 110.454 64.1385 117.599 64.1385H128.903V75.6666H119.507C112.167 75.6666 108.496 80.2481 108.496 89.4112V99.4611H126.995V111.136H108.496V180.895H94.6952V111.136H81.3351ZM133.014 111.136V99.4611H146.375V88.2287C146.375 80.0513 148.381 73.9917 152.394 70.0509C156.504 66.109 162.132 64.1385 169.277 64.1385H180.583V75.6666H171.186C163.845 75.6666 160.175 80.2481 160.175 89.4112V99.4611H178.673V111.136H160.175V180.895H146.375V111.136H133.014ZM193.502 83.3516V66.5035H209.798V83.3516H193.502ZM194.97 180.895V99.4611H208.477V180.895H194.97ZM226.976 164.49L237.106 158.578C242.881 167.545 250.613 172.027 260.303 172.027C265.783 172.027 270.188 170.993 273.516 168.924C276.844 166.854 278.508 163.948 278.508 160.204C278.508 158.824 278.264 157.543 277.773 156.362C277.383 155.179 276.502 154.096 275.131 153.11C273.859 152.026 272.733 151.189 271.754 150.598C270.874 149.907 269.161 149.12 266.615 148.233C264.169 147.346 262.31 146.705 261.037 146.312C258.788 145.564 256.537 144.825 254.284 144.094C250.76 143.01 247.775 141.927 245.327 140.843C242.979 139.661 240.433 138.183 237.693 136.409C235.05 134.537 233.044 132.222 231.674 129.463C230.304 126.704 229.618 123.551 229.618 120.004C229.618 113.107 232.408 107.541 237.987 103.304C243.664 98.9687 251.102 96.8006 260.303 96.8006C266.958 96.8006 273.125 98.5743 278.802 102.122C284.478 105.57 288.589 109.807 291.133 114.831L281.885 120.743C279.634 117.295 276.648 114.388 272.929 112.023C269.209 109.56 265.05 108.329 260.449 108.329C254.968 108.329 250.76 109.412 247.823 111.58C244.985 113.65 243.565 116.507 243.565 120.152C243.565 122.319 244.105 124.29 245.181 126.063C246.356 127.738 248.215 129.266 250.76 130.645C253.304 131.926 255.458 132.911 257.219 133.601C259.079 134.291 261.771 135.178 265.294 136.262C268.915 137.345 272.048 138.478 274.69 139.661C277.432 140.843 280.27 142.37 283.206 144.242C286.142 146.114 288.393 148.429 289.96 151.189C291.624 153.947 292.455 157.001 292.455 160.352C292.455 166.854 289.617 172.372 283.94 176.904C278.264 181.338 270.433 183.555 260.449 183.555C253.011 183.555 246.404 181.88 240.63 178.53C234.855 175.18 230.304 170.5 226.976 164.49ZM303.32 139.661C303.32 126.852 306.794 116.507 313.743 108.624C320.693 100.742 329.599 96.8006 340.464 96.8006C351.328 96.8006 359.99 100.693 366.45 108.477C373.008 116.261 376.286 126.212 376.286 138.33C376.286 139.907 376.189 142.074 375.993 144.834H317.267C317.267 152.322 319.371 158.775 323.58 164.194C327.886 169.515 333.759 172.175 341.198 172.175C351.181 172.175 358.473 167.84 363.073 159.169L374.672 162.864C372.127 168.874 367.967 173.85 362.192 177.791C356.516 181.633 349.469 183.555 341.051 183.555C329.796 183.555 320.693 179.565 313.743 171.583C306.794 163.505 303.32 152.864 303.32 139.661ZM317.561 134.635H362.339C362.339 127.246 360.381 120.99 356.467 115.866C352.552 110.743 347.217 108.181 340.464 108.181C333.612 108.181 328.131 110.841 324.021 116.162C319.909 121.384 317.756 127.542 317.561 134.635ZM393.17 180.895V99.4611H406.678V112.172H406.824C408.097 108.525 410.886 105.078 415.193 101.826C419.597 98.4764 424.98 96.8006 431.342 96.8006C439.075 96.8006 445.339 99.2149 450.134 104.043C455.028 108.87 457.475 116.95 457.475 128.281V180.895H443.528V130.498C443.528 115.817 438.438 108.477 428.259 108.477C422.484 108.477 417.493 110.89 413.283 115.718C409.173 120.448 407.118 126.162 407.118 132.863V180.895H393.17ZM472.451 164.49L482.581 158.578C488.356 167.545 496.088 172.027 505.778 172.027C511.258 172.027 515.663 170.993 518.99 168.924C522.318 166.854 523.983 163.948 523.983 160.204C523.983 158.824 523.737 157.543 523.248 156.362C522.857 155.179 521.976 154.096 520.605 153.11C519.333 152.026 518.208 151.189 517.229 150.598C516.348 149.907 514.635 149.12 512.09 148.233C509.643 147.346 507.783 146.705 506.511 146.312C504.263 145.564 502.012 144.825 499.758 144.094C496.234 143.01 493.25 141.927 490.802 140.843C488.453 139.661 485.908 138.183 483.168 136.409C480.525 134.537 478.518 132.222 477.148 129.463C475.778 126.704 475.093 123.551 475.093 120.004C475.093 113.107 477.883 107.541 483.461 103.304C489.138 98.9687 496.577 96.8006 505.778 96.8006C512.433 96.8006 518.6 98.5743 524.276 102.122C529.953 105.57 534.063 109.807 536.608 114.831L527.359 120.743C525.108 117.295 522.123 114.388 518.403 112.023C514.684 109.56 510.524 108.329 505.924 108.329C500.443 108.329 496.234 109.412 493.298 111.58C490.459 113.65 489.04 116.507 489.04 120.152C489.04 122.319 489.578 124.29 490.656 126.063C491.83 127.738 493.69 129.266 496.234 130.645C498.779 131.926 500.933 132.911 502.694 133.601C504.554 134.291 507.245 135.178 510.769 136.262C514.39 137.345 517.522 138.478 520.165 139.661C522.905 140.843 525.744 142.37 528.68 144.242C531.617 146.114 533.868 148.429 535.434 151.189C537.098 153.947 537.93 157.001 537.93 160.352C537.93 166.854 535.092 172.372 529.415 176.904C523.737 181.338 515.908 183.555 505.924 183.555C498.485 183.555 491.878 181.88 486.104 178.53C480.329 175.18 475.778 170.5 472.451 164.49ZM548.794 139.661C548.794 126.852 552.268 116.507 559.218 108.624C566.167 100.742 575.074 96.8006 585.938 96.8006C596.803 96.8006 605.464 100.693 611.925 108.477C618.482 116.261 621.761 126.212 621.761 138.33C621.761 139.907 621.664 142.074 621.467 144.834H562.741C562.741 152.322 564.846 158.775 569.054 164.194C573.361 169.515 579.234 172.175 586.672 172.175C596.655 172.175 603.948 167.84 608.548 159.169L620.146 162.864C617.601 168.874 613.441 173.85 607.667 177.791C601.99 181.633 594.942 183.555 586.526 183.555C575.269 183.555 566.167 179.565 559.218 171.583C552.268 163.505 548.794 152.864 548.794 139.661ZM563.035 134.635H607.813C607.813 127.246 605.856 120.99 601.941 115.866C598.026 110.743 592.691 108.181 585.938 108.181C579.087 108.181 573.605 110.841 569.495 116.162C565.384 121.384 563.231 127.542 563.035 134.635Z"
          fill="#73DCBA"
        />
        <path
          d="M546.81 6.32295L533.914 9.4143L536.985 22.3962L549.88 19.3048L546.81 6.32295Z"
          fill="#73DCBA"
        />
        <path
          d="M699.728 144.627L686.832 147.718L689.903 160.7L702.798 157.609L699.728 144.627Z"
          fill="#73DCBA"
        />
        <path
          d="M675.674 126.466L662.778 129.557L665.849 142.539L678.744 139.448L675.674 126.466Z"
          fill="#73DCBA"
        />
        <path
          d="M595.311 0L569.863 5.47747L575.304 31.0952L600.753 25.6177L595.311 0.00100897V0Z"
          fill="#73DCBA"
        />
        <path
          d="M632.922 22.7231L616.379 26.2846L619.916 42.9369L636.459 39.3764L632.922 22.7231Z"
          fill="#73DCBA"
        />
        <path
          d="M698.364 67.9482L681.821 71.5088L685.358 88.1621L701.901 84.6006L698.364 67.9482Z"
          fill="#73DCBA"
        />
        <path
          d="M671.671 36.8501L646.774 42.2075L652.097 67.2713L676.995 61.9128L671.671 36.8501Z"
          fill="#73DCBA"
        />
        <path
          d="M667.574 88.1268L646.742 95.4506L654.018 116.421L674.849 109.098L667.574 88.1268Z"
          fill="#73DCBA"
        />
        <path
          d="M670.171 152.699L643.735 158.389L649.387 185L675.823 179.311L670.171 152.699Z"
          fill="#73DCBA"
        />
        <path
          d="M710.206 101.243L685.83 107.075L691.624 131.614L716 125.782L710.206 101.243Z"
          fill="#73DCBA"
        />
      </g>
      <defs>
        <clipPath id="clip0_214_2">
          <rect width="716" height="185" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Logo;
