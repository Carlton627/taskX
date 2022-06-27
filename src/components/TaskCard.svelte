<script>
	export let cardProps;
	export let taskData;
	export let dateMessage;
	export let styleClass;

	function deleteTask(taskId) {
		console.log(taskId);
	}
</script>

<main>
	<div class="card task-card">
		<div class="card-content">
			<div class="level">
				<div class="level-left">
					<div class="level-item">
						<p class="subtitle is-6 tag {cardProps.tagClassName}">
							{taskData.status === 'inProgress'
								? taskData.status.split('P').join(' p')
								: taskData.status}
						</p>
					</div>
				</div>
				<div class="level-right">
					<div class="level-item">
						{#if taskData.setDeadline}
							<span class="deadline {styleClass}">
								<i class="fa-regular fa-clock" />
								{dateMessage}
							</span>
						{/if}
					</div>
				</div>
			</div>
			<p class="title">{taskData.name}</p>
			<div class="content">
				{taskData.description}
			</div>
		</div>
		<div class="card-footer">
			<button class="delete-task card-footer-item" on:click={deleteTask(taskData.id)}>
				Delete
			</button>
			{#if cardProps.btn}
				<button class="${cardProps.btnClassName} card-footer-item">
					{cardProps.btn}
				</button>
			{/if}
		</div>
	</div>
</main>
