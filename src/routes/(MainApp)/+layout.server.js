import prisma from '$lib/db';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
	let user = await prisma.users.findFirst({
		where: {
			email: {
				equals: params.userEmail
			}
		}
	});
	if (!user) throw error(404, 'Account not found')

	if (!user.online) {
		user = await prisma.users.update({
			where: {
				id: user.id
			},
			data: {
				online: true
			}
		})
		if (!user) throw error(404, 'Account not found');
	}

	let notifications = await prisma.notifications.findMany({
		where: {
			OR: user.notifications.map(id => {return{id}})
		}
	})

	notifications = notifications.reverse()

	const invitations = await prisma.invitations.findMany({
		where: {
			OR: user.invitations.map(id => {return{id}})
		}
	})

	let profiles = await prisma.users.findMany({
		where: {
			OR: notifications.map(n => {return{id: n.for.userID}})
		},
		select: {
			id: true,
			profile: true
		}
	})
	/** 
	 * @type {{notifID: string, profile: string}[]} 
	 * */
	let notifFromPic = []
	notifications.forEach(notif => {
		notifFromPic = [
			...notifFromPic,
			{
				notifID: notif.id,
				profile: profiles.filter(u => u.id === notif.for.userID)[0].profile
			}
		]
	})
	// console.log(notifFromPic);

	return { user, notifications, invitations, notifFromPic };
}