<script>
	import TaskList from '../components/TaskList.svelte';
	import { checkAuthState } from '../db/fireauth';
	import '../global.css';

	export let userDetails = '';

	checkAuthState((user) => {
		if (user) {
			userDetails = user;
		} else {
			userDetails = '';
		}
	});
</script>

<main>
	{#if !userDetails}
		<section class="banner">
			<div class="hero is-fullheight-with-navbar">
				<div class="hero-body">
					<div class="columns">
						<div class="column is-half">
							<img src="/taskX_logo.png" alt="taskX logo" />
						</div>
						<div class="column">
							<img src="/tasks_home.svg" alt="taskX banner" />
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}
	{#if userDetails}
		<TaskList userId={userDetails.uid} />
	{/if}
</main>
