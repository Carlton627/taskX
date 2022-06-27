<script>
	import { renderErrorToast } from '../configs/helpers';
	import { getTasksFromFirestore } from '../db/firestore';

	import TaskCard from './TaskCard.svelte';

	export let userId;

	export const cardProps = {
		btn: 'BtnName',
		tagClassName: 'is-warning',
		btnClassName: 'mark__in-progress'
	};

	let taskData = [];
	let todoTasks = [];
	let inProgressTasks = [];
	let completedTasks = [];
	(async () => {
		try {
			const taskDataSnapshot = await getTasksFromFirestore(userId);

			taskDataSnapshot.forEach((task) => {
				taskData = [...taskData, task.data()];
			});

			todoTasks = taskData.filter((task) => task.status === 'todo');
			inProgressTasks = taskData.filter((task) => task.status === 'inProgress');
			completedTasks = taskData.filter((task) => task.status === 'completed');
		} catch (err) {
			renderErrorToast(err.message);
			return { error: new Error('Could not fetch the Tasks') };
		}
	})();
</script>

<main>
	<section class="task-list">
		{#if taskData.length}
			<div class="columns">
				<div class="todo column is-one-third">
					<div class="task-header level">
						<div class="level-left">
							<h1 class="title is-2 level-item">Todos</h1>
						</div>
						{#if todoTasks || (Array.isArray(todoTasks) && todoTasks.length !== 0)}
							<div class="level-right">
								<button class="button delete-all is-danger is-light level-item">
									Delete all
								</button>
							</div>
						{/if}
					</div>
					{#each todoTasks as todo}
						<TaskCard {cardProps} taskData={todo} />
					{/each}
				</div>
				<div class="in-progress column">
					<div class="task-header level">
						<div class="level-left">
							<h1 class="title is-2 level-item">In Progress</h1>
						</div>
						{#if inProgressTasks || (Array.isArray(inProgressTasks) && inProgressTasks.length !== 0)}
							<div class="level-right">
								<button class="button delete-all is-danger is-light level-item">
									Delete all
								</button>
							</div>
						{/if}
					</div>
					{#each inProgressTasks as inProgress}
						<TaskCard {cardProps} taskData={inProgress} />
					{/each}
				</div>
				<div class="completed column">
					<div class="task-header level">
						<div class="level-left">
							<h1 class="title is-2 level-item">Completed</h1>
						</div>
						{#if completedTasks || (Array.isArray(completedTasks) && completedTasks.length !== 0)}
							<div class="level-right">
								<button class="button delete-all is-danger is-light level-item">
									Delete all
								</button>
							</div>
						{/if}
					</div>
					{#each completedTasks as completed}
						<TaskCard {cardProps} taskData={completed} />
					{/each}
				</div>
			</div>
		{:else}
			<div class="spinner">
				<progress class="progress is-small is-danger" max="100" />
			</div>
		{/if}
	</section>
</main>
