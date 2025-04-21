<div>
    <h1 class="text-6xl font-mono text-center mt-10">Welcome to Server Nexus!</h1>
    <p class="font-mono text-xl text-center mt-10">We are excited to have you!</p>
</div>

<div class="card w-96 bg-base-100 card-lg shadow-sm m-auto mt-10">
    <div class="card-body">
        <div class="text-center">
            <input class="input validator font-mono bg-base-300" type="email" required placeholder="Enter Email" />
            <div class="validator-hint">Enter valid email address</div>
        </div>
        <div class="text-center mt-5">
            <input type="input" class="input validator font-mono bg-base-300" required placeholder="Create Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*" minlength="4" maxlength="20" title="Username" />
            <p class="validator-hint">
                Username can contain:
                <br/>4-20 characters
                <br/>Letters, numbers, dashes
            </p>
        </div>
        <div class="text-center mt-5">
            <input type="password" class="input validator font-mono bg-base-300" required placeholder="Create Password" minlength="8"
                pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-+]).{8,}"}
                title="Password" />
            <p class="validator-hint">
                Password must contain:
                <br/>At least 8 characters
                <br/>At least 1 number (0-9)
                <br/>At least 1 lowercase letter (a-z)
                <br/>At least 1 uppercase letter (A-Z)
                <br/>At least 1 special character (i.e., !@#$%^&*)
            </p>
        </div>
        <div class="text-center mt-5">
            <button class="btn btn-xl btn-primary">
                <a class="font-mono" href="#/login">Sign Up</a>
            </button>
            <p class="mt-5 font-mono text-sm">Already have an account?
                <a class="font-mono text-sm underline" href="#/login">Login!</a>
            </p>
        </div>
    </div>
  </div>
