<div class="task-creator modal">
	<div class="modal-background overlay" />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Create a Task</p>
			<button class="delete close-form" aria-label="close" />
		</header>
		<section class="modal-card-body">
			<form class="task-upload">
				<div class="field">
					<label for="status" class="label">Choose task status</label>
					<div class="control">
						<div class="select">
							<select name="status" class="task-status">
								<option value="todo">To-do</option>
								<option value="inProgress"> In progress </option>
							</select>
						</div>
					</div>
				</div>
				<div class="field">
					<label for="name" class="label">Task Name</label>
					<div class="control">
						<input
							type="text"
							name="name"
							class="input"
							placeholder="Debug app.js"
							required
						/>
					</div>
				</div>

				<div class="field">
					<label for="description" class="label">Describe the task at hand</label>
					<div class="control">
						<textarea
							placeholder="Don't write a novel :D"
							class="textarea"
							name="description"
							required
						/>
					</div>
				</div>
				<hr />
				<div class="field">
					<div class="control">
						<div class="checkbox">
							<label class="label">
								Set Deadline? &nbsp;
								<input
									type="checkbox"
									name="setDeadline"
									class="deadline-checkbox"
								/>
							</label>
						</div>
					</div>
				</div>
				<div class="field is-grouped dates">
					<div class="control">
						<div class="date">
							<label for="startsOn" class="label"> Start date </label>
							<input type="date" class="input start-date" name="startsOn" disabled />
							<p class="help is-danger start-error-text-1 hidden" />
							<p class="help is-danger start-error-text-2 hidden" />
						</div>
					</div>
					<div class="control">
						<div class="date">
							<label for="deadline" class="label">End date</label>
							<input
								type="date"
								class="input deadline-date"
								name="deadline"
								disabled
							/>
						</div>
						<p class="help is-danger end-error-text-1 hidden" />
						<p class="help is-danger end-error-text-2 hidden" />
					</div>
				</div>
				<article class="message is-warning">
					<div class="message-header">
						<p>Note&nbsp;:</p>
					</div>
					<div class="message-body">
						Start date allows you to create a task on which you want to start working on
						for a future date. Leave the start date blank if you want to start working
						on the task from the date of creation.
					</div>
				</article>
				<hr />
				<div class="field is-grouped">
					<div class="control">
						<button type="submit" class="submit-form button is-warning">
							Submit
						</button>
					</div>
					<div class="control">
						<button type="button" class="button btn-close is-warning is-light">
							Cancel
						</button>
					</div>
				</div>
			</form>
		</section>
		<footer class="modal-card-foot">
			<p class="subtitle is-6">TaskX&copy; doesn't share your data with anyone</p>
		</footer>
	</div>
</div>
