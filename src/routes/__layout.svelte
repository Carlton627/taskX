<script>
	import { signOutUser, googleSignIn, checkAuthState } from '../db/fireauth';
	import { renderErrorToast } from '../configs/helpers';
	import AddTask from '../components/AddTask.svelte';

	export let userData = {
		uid: '',
		photoURL: '',
		firstName: '',
		email: '',
		creationTime: ''
	};
	export let openTaskModal = false;
	export let disableSignIn = false;

	checkAuthState((user) => {
		if (user) {
			userData.uid = user?.uid;
			userData.firstName = user?.displayName.split(' ')[0];
			userData.photoURL = user?.photoURL;
			userData.email = user?.email;
			userData.creationTime = user?.metadata?.creationTime;
		} else {
			userData.uid = '';
			userData.firstName = '';
			userData.photoURL = '';
			userData.email = '';
			userData.creationTime = '';
		}
	});

	const signIn = async function () {
		try {
			disableSignIn = true;
			await googleSignIn();
		} catch (err) {
			renderErrorToast(err.message);
		} finally {
			disableSignIn = false;
		}
	};

	const signOut = async function () {
		try {
			await signOutUser();
		} catch (err) {
			renderErrorToast(err.message);
		}
	};
</script>

<nav class="navbar is-warning navbar-main">
	<div class="navbar-brand">
		<div class="navbar-item">
			<img class="nav-logo" src="/taskX_logo_nav.png" alt="" />
		</div>
	</div>
	<div class="navbar-end">
		{#if !userData.email}
			<div class="navbar-item">
				<button
					class="button button-login is-light"
					on:click={signIn}
					disabled={disableSignIn}
				>
					<img src="/Google__G__Logo.svg" alt="" />
					&nbsp;Sign in
				</button>
			</div>
		{:else}
			<span class="user-signed-in">
				<div class="navbar-item">
					<button
						on:click={() => (openTaskModal = true)}
						class="nav__btn--new-task button is-warning is-light"
					>
						New task
					</button>
				</div>
			</span>

			<div class="user-signed-in navbar-item has-dropdown is-hoverable">
				<div class="navbar-link username">
					Hi {userData.firstName} &nbsp;
					<img async src={userData.photoURL} alt="" class="user-img" />
				</div>
				<div class="navbar-dropdown">
					<span class="button-logoff navbar-item" on:click={signOut}>Sign out</span>
					<hr class="navbar-divider" />
					<p class="navbar-item is-warning">TaskX&copy; 2.0.0</p>
				</div>
			</div>
		{/if}
	</div>
</nav>

<AddTask {openTaskModal} />

<slot />

{#if !userData.email}
	<footer class="footer">
		<div class="content has-text-centered">
			<p>
				<strong>TaskX&copy;</strong> created by
				<a href="https://carltonrodrigues.com" target="_blank">Carlton Rodrigues</a>
			</p>
			<span class="icon">
				<a class="twitter-icon" target="_blank" href="https://twitter.com/CarltonRodz?s=09">
					<i class="fab fa-twitter" />
				</a>
			</span>
			<span class="icon">
				<a class="github-icon" target="_blank" href="https://github.com/Carlton627">
					<i class="fa fa-github" />
				</a>
			</span>
			<span class="icon">
				<a
					href="https://linkedin.com/in/carlton-rodrigues"
					target="_blank"
					class="linkedin-icon"
				>
					<i class="fa fa-linkedin" />
				</a>
			</span>
		</div>
	</footer>
{/if}

<style>
	.button-logoff {
		cursor: pointer;
	}
</style>
